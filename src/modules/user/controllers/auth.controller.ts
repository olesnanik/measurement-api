import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-user-dto';
import { LoginUserResponseDto } from '../dto/login-user-response-dto';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginUserResponseDto> {
    return await this.authService.login(loginUserDto);
  }
}
