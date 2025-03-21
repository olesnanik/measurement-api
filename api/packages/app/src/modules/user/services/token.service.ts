import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToken } from '../entities/user-token.entity';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
  ) {}

  async saveToken(
    user: User,
    accessToken: string,
    refreshToken: string,
  ): Promise<UserToken> {
    const newToken = this.userTokenRepository.create({
      user,
      accessToken,
      refreshToken,
    });
    return await this.userTokenRepository.save(newToken);
  }

  async updateToken(
    userToken: UserToken,
    accessToken: string,
    refreshToken: string,
  ): Promise<UserToken> {
    userToken.accessToken = accessToken;
    userToken.refreshToken = refreshToken;
    await this.userTokenRepository.update({ id: userToken.id }, userToken);
    return userToken;
  }

  async removeByAccessToken(accessToken: string): Promise<void> {
    await this.userTokenRepository.delete({ accessToken });
  }

  async findByAccessToken(accessToken: string): Promise<UserToken | null> {
    return await this.userTokenRepository.findOne({
      where: { accessToken },
      relations: ['user'],
    });
  }

  async removeByRefreshToken(refreshToken: string): Promise<void> {
    await this.userTokenRepository.delete({ refreshToken });
  }

  async findByRefreshToken(refreshToken: string): Promise<UserToken | null> {
    return await this.userTokenRepository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });
  }
}
