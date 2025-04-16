import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { UserCreateDto } from '../dto/user-create-dto';
import { AuthService } from './auth.service';
import { QueryFailedError } from 'typeorm';
import { Request } from 'express';
import { UserBaseInfoResponseDto } from '../dto/user-base-info-response-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create({ name, login, password }: UserCreateDto): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        name,
        login,
        password: await this.authService.getHashedPassword(password),
      });

      return await this.userRepository.save(newUser);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        const driverError = e.driverError as { code: string };
        if (driverError.code === '23505')
          throw new ConflictException(
            'A user with this name or login already exists.',
          );
      }

      throw e;
    }
  }

  getBaseInfo(request: Request): UserBaseInfoResponseDto {
    const user = request.user;
    if (!user) throw new BadRequestException();

    return {
      name: user.name,
      login: user.login,
    };
  }
}
