import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../guards/admin-auth-guard';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { UserCreateDto } from '../dto/user-create-dto';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../guards/auth.guard';

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

  @Get('protected')
  @ApiBearerAuth('user-bearer-auth')
  @UseGuards(AuthGuard)
  hello() {
    return 'hellooooo!!!!';
  }
}
