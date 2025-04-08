// auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus, HttpException, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';
  
@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const { email, nickname, password } = loginDto;

    if (!email && !nickname) {
      throw new HttpException('Email o nickname son requeridos', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password es requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      const loginField = (email || nickname) as string;

      const { token, user } = await this.authService.login(loginField, password);

      return {
        msg: 'Inicio de sesión exitoso',
        token,
        user,
      };
    } catch (error) {
      console.error('Error en login controller:', error);
      throw new HttpException(
        error.response || 'Error en el proceso de autenticación',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) 
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: any): Promise<any> { 
    return {
      msg: 'Perfil accesible solo para usuarios autenticados',
      user: req.user, 
    };
  }
}
