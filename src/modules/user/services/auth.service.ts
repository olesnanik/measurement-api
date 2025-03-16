import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { AppConfigService } from '../../app-config/app-config.service';
import { LoginUserDto } from '../dto/login-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginUserResponseDto } from '../dto/login-user-response-dto';
import { TokenService } from './token.service';
import { nanoid } from 'nanoid';

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
  }: LoginUserDto): Promise<LoginUserResponseDto> {
    const user = await this.userRepository.findOneBy({
      login,
      password: await this.getHashedPassword(password),
    });
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const payload: TokenPayload = { sub: user.id, login: user.login };
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

    await this.tokenService.saveToken(user, accessToken, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
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
}

type TokenPayload = {
  sub: number;
  login: string;
};
