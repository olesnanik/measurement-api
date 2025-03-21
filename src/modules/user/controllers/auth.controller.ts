import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginDto } from '../dto/user-login-dto';
import { UserTokenResponseDto } from '../dto/user-token-response-dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserRefreshDto } from '../dto/user-refresh.dto';
import { UserLogoutDto } from '../dto/user-logout.dto';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: UserTokenResponseDto })
  async login(
    @Body() loginUserDto: UserLoginDto,
  ): Promise<UserTokenResponseDto> {
    return await this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @ApiOkResponse({ type: UserTokenResponseDto })
  async refresh(@Body() authRefreshDto: UserRefreshDto) {
    return await this.authService.refresh(authRefreshDto);
  }

  @Post('logout')
  @ApiOkResponse()
  async logout(@Body() userLogoutDto: UserLogoutDto) {
    return await this.authService.logout(userLogoutDto);
  }
}
