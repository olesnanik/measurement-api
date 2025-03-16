import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService as NestjsConfigService } from '@nestjs/config';
import { z } from 'zod';

@Injectable()
export class AppConfigService {
  constructor(private readonly nestjsConfigService: NestjsConfigService) {}

  getPasswordSalt(): string {
    return this.getStringPropOrThrowError('API_PASSWORD_SALT');
  }

  getStringPropOrThrowError<K extends keyof EnvConfig>(key: K): string {
    const value = this.get(key);
    if (!value) {
      console.error(`Env "${key}" has not been specified`);
      throw new InternalServerErrorException();
    }

    return value;
  }

  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] | undefined {
    return this.nestjsConfigService.get<EnvConfig[K]>(key);
  }
}

export function getValidationSchema() {
  return z.object({
    API_PASSWORD_SALT: z.string(),
    API_USER_ADMIN_BASIC_USERNAME: z.string(),
    API_USER_ADMIN_BASIC_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
  });
}

export type EnvConfig = z.infer<ReturnType<typeof getValidationSchema>>;
