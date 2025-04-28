import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No se proporcionó un token válido.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = decoded;
      console.log('Decoded JWT:', decoded);
      return true;
    } catch (error) {
      console.error('JWT verification failed:', error);

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('El token ha expirado. Inicia sesión de nuevo.');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('El token no es válido.');
      }

      throw new UnauthorizedException('Acceso no autorizado.');
    }
  }
}