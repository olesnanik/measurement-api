import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        type: 'postgres',
        host: appConfigService.getStringPropOrThrowError('DB_HOST'),
        port: +appConfigService.getStringPropOrThrowError('DB_PORT'),
        username: appConfigService.getStringPropOrThrowError('DB_USERNAME'),
        password: appConfigService.getStringPropOrThrowError('DB_PASSWORD'),
        database: appConfigService.getStringPropOrThrowError('DB_DATABASE'),
        synchronize: true, // Auto-create tables (only for development)
        namingStrategy: new SnakeNamingStrategy(),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
