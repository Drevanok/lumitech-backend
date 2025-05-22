import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  HttpException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Response, Request } from 'express';


@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Endpoint to login the user
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    const { access_token, refresh_token, user } =
      await this.authService.login(loginDto);

    if (!refresh_token) {
      throw new Error('Refresh token is undefined');
    }

    // Set cookie
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    // Send response manually
    res.status(HttpStatus.OK).json({
      msg: 'Inicio de sesión exitoso',
      refresh_token,
      access_token,
      user,
    });
  }

  // Endpoint to refresh access_token
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new HttpException(
        'No refresh token found in cookies',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.authService.refreshToken(refreshToken);
  }
}
