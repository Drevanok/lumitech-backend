import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

import { UserService } from '../services/user.service';
import { CreateUserDto } from '../../auth/dto/create-user.dto';

@Controller('user') // Prefix route
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register') // Route register user
  @HttpCode(HttpStatus.CREATED) // Return code 201 if response is successful
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.userService.createUser(createUserDto);
    return { message: 'Usuario registrado correctamente' };
  }

  @Post('forget-password')
  async forgetPassword(@Body('email') email: string): Promise<{ msg: string }> {
    try {
      return await this.userService.forgetPassword(email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ msg: string }> {
    try {
      return await this.userService.resetPassword(token, newPassword);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
