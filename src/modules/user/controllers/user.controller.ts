import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '../guards/admin-auth-guard';
import {
  ApiBasicAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user-dto';
import { UserService } from '../services/user.service';

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
  async getHello(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.create(createUserDto);
  }
}
