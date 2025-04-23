import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../interfaces/login-response';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<LoginResponse & { msg: string }> {
    const { token, user } = await this.authService.login(loginDto);

    return {
      msg: 'Inicio de sesión exitoso',
      token,
      user,
    };
  }
}
