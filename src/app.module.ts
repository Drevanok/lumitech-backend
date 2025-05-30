import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { RosetaModule } from './roseta/roseta.module';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      logging: true,
    }),
    UserModule,
    AuthModule,
    RosetaModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .exclude(
        { path: 'roseta/received-ip', method: RequestMethod.POST },
        { path: 'roseta/sensor-data', method: RequestMethod.POST },
        { path: 'roseta/alerts/:mac', method: RequestMethod.GET },
        { path: 'roseta/sensor/:mac', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
