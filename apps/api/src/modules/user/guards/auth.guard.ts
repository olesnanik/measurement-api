import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '../../shared/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.authService.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let user: User | null = null;

    try {
      user = await this.authService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException();
    }

    if (!user) throw new UnauthorizedException();

    request.user = user;
    return true;
  }
}
