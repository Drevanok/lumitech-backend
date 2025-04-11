import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      const { token, user } = await this.authService.login(loginDto);

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
