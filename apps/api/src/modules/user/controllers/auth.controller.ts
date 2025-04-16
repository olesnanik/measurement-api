import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginDto } from '../dto/user-login-dto';
import { UserTokenResponseDto } from '../dto/user-token-response-dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserRefreshDto } from '../dto/user-refresh.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Request } from 'express';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: UserTokenResponseDto })
  login(@Body() loginUserDto: UserLoginDto): Promise<UserTokenResponseDto> {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh')
  @ApiOkResponse({ type: UserTokenResponseDto })
  refresh(@Body() authRefreshDto: UserRefreshDto) {
    return this.authService.refresh(authRefreshDto);
  }

  @Post('logout')
  @ApiBearerAuth('user-bearer-auth')
  @UseGuards(AuthGuard)
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @HttpCode(204)
  async logout(@Req() request: Request) {
    await this.authService.logout(request);
  }
}
