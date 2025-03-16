import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { AppConfigService } from '../../app-config/app-config.service';

@Injectable()
export class AuthService {
  constructor(private readonly appConfigService: AppConfigService) {}

  async getHashedPassword(password: string): Promise<string> {
    return await bcryptjs.hash(
      password,
      this.appConfigService.getPasswordSalt(),
    );
  }
}
