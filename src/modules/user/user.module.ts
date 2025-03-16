import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../shared/entities/user.entity';
import { UserToken } from './entities/user-token.entity';
import { UserService } from './services/user.service';
import { TokenService } from './services/token.service';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { AppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, UserToken]),
    AppConfigModule,
  ],
  providers: [UserService, TokenService, AuthService],
  controllers: [UserController],
})
export class UserModule {}
