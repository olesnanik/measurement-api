import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AppConfigService } from '../../app-config/app-config.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly appConfigService: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing Authorization Header');
    }

    // Decode Base64 credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [username, password] = credentials.split(':');

    // Validate credentials (Replace with a real authentication service)
    if (
      username !==
        this.appConfigService.getStringPropOrThrowError(
          'API_USER_ADMIN_BASIC_USERNAME',
        ) ||
      password !==
        this.appConfigService.getStringPropOrThrowError(
          'API_USER_ADMIN_BASIC_PASSWORD',
        )
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }
}
