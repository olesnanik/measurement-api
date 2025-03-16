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
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../app-config/app-config.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, UserToken]),
    AppConfigModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.getStringPropOrThrowError('API_JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [UserService, TokenService, AuthService],
  controllers: [UserController, AuthController],
})
export class UserModule {}
