import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { CreateUserDto } from '../dto/create-user-dto';
import { AuthService } from './auth.service';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create({ name, login, password }: CreateUserDto): Promise<User> {
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
}
