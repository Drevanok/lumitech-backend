import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CheckAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ msg: 'Token no enviado o inválido' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      }) as { userId: string };

      if (!decoded?.userId) {
        return res.status(403).json({ msg: 'Token inválido o mal formado' });
      }

      const [user] = await this.dataSource.query(
        'SELECT uuid, user_email FROM users WHERE user_email = ?',
        [decoded.userId],
      );

      if (!user) {
        return res.status(403).json({ msg: 'Token válido pero usuario no encontrado' });
      }

      (req as any).user = user;
      next();
    } catch (error) {
      return res.status(403).json({ msg: 'Token inválido', error: error.message });
    }
  }
}

