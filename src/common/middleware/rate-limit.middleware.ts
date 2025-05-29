// src/common/middleware/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: {
      statusCode: 429,
      message: 'Demasiadas peticiones. Intenta de nuevo más tarde.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next);
  }
}
