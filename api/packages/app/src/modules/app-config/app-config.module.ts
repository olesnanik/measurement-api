import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService, getValidationSchema } from './app-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validate: (config) => getValidationSchema().parse(config),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
