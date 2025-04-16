import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { AppConfigService } from '../../app-config/app-config.service';
import { UserLoginDto } from '../dto/user-login-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserTokenResponseDto } from '../dto/user-token-response-dto';
import { TokenService } from './token.service';
import { nanoid } from 'nanoid';
import { UserRefreshDto } from '../dto/user-refresh.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly appConfigService: AppConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async login({
    login,
    password,
  }: UserLoginDto): Promise<UserTokenResponseDto> {
    const user = await this.userRepository.findOneBy({
      login,
      password: await this.getHashedPassword(password),
    });
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    return this.generateAndSaveNewTokens(user);
  }

  async verifyAccessToken(accessToken: string): Promise<User | null> {
    const payload = await this.jwtService.verifyAsync<TokenPayload>(
      accessToken,
      {
        secret:
          this.appConfigService.getStringPropOrThrowError('API_JWT_SECRET'),
      },
    );

    const userToken = await this.tokenService.findByAccessToken(accessToken);
    return userToken?.user?.id === payload.sub ? userToken.user : null;
  }

  async getHashedPassword(password: string): Promise<string> {
    return await bcryptjs.hash(
      password,
      this.appConfigService.getPasswordSalt(),
    );
  }

  async refresh({
    refreshToken,
  }: UserRefreshDto): Promise<UserTokenResponseDto> {
    const userToken = await this.tokenService.findByRefreshToken(refreshToken);
    if (!userToken?.user) throw new UnauthorizedException();

    const { user } = userToken;
    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens({
      login: user.login,
      sub: user.id,
    });

    await this.tokenService.updateToken(
      userToken,
      accessToken,
      newRefreshToken,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(request: Request): Promise<void> {
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) throw new BadRequestException();

    await this.tokenService.removeByAccessToken(accessToken);
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async generateAndSaveNewTokens(
    user: User,
  ): Promise<UserTokenResponseDto> {
    const { accessToken, refreshToken } = this.generateTokens({
      sub: user.id,
      login: user.login,
    });
    await this.tokenService.saveToken(user, accessToken, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateTokens(payload: TokenPayload): UserTokenResponseDto {
    const keyid = nanoid(10);
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.getStringPropOrThrowError('API_JWT_SECRET'),
      keyid,
      expiresIn: '5m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.getStringPropOrThrowError(
        'API_JWT_REFRESH_SECRET',
      ),
      keyid,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}

type TokenPayload = {
  sub: number;
  login: string;
};
