import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No se proporcionó un token válido.');
    }

    const token = authHeader.split(' ')[1];

    console.log('Token recibido:', token);


    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      console.log('Decoded payload:', decoded);

      // verify token_version
      const [tokenVersion] = await this.dataSource.query(
        `CALL get_token_version(?)`,
        [decoded.uuid],
      );

      console.log(tokenVersion)
      const version = tokenVersion[0]

      console.log(version)
      const dbTokenVersion = version?.token_version;

      console.log(dbTokenVersion)
      if (dbTokenVersion === undefined) {
        throw new UnauthorizedException(
          'No se pudo verificar la versión del token.',
        );
      }

      if (dbTokenVersion === null || dbTokenVersion === undefined) {
        throw new UnauthorizedException(
          'No se pudo verificar la versión del token.',
        );
      }

      if (Number(decoded.tokenVersion) !== Number(dbTokenVersion)) {
        throw new UnauthorizedException(
          'El token ya no es válido (versión desactualizada).',
        );
      }

      // save user to request
      request.user = decoded;

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'El token ha expirado. Inicia sesión de nuevo.',
        );
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('El token no es válido.');
      }

      throw new UnauthorizedException('Acceso no autorizado.');
    }
  }
}
