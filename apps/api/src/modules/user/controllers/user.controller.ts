import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { UserCreateDto } from '../dto/user-create-dto';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../guards/auth.guard';
import { UserBaseInfoResponseDto } from '../dto/user-base-info-response-dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBasicAuth('basic-auth')
  @UseGuards(AdminAuthGuard)
  @ApiConflictResponse({
    description: 'A user with this name or login already exists.',
  })
  @ApiCreatedResponse({ description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(@Body() createUserDto: UserCreateDto): Promise<void> {
    await this.userService.create(createUserDto);
  }

  @Get('base-info')
  @ApiBearerAuth('user-bearer-auth')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: UserBaseInfoResponseDto })
  @ApiBadRequestResponse()
  baseInfo(@Req() request: Request) {
    return this.userService.getBaseInfo(request);
  }
}
