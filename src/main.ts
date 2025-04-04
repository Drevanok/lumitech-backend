import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as dotenv from 'dotenv';

dotenv.config();

async function lumintechApp() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Habilitar CORS si lo necesitas
  // app.enableCors({
  //   origin: process.env.FRONT_URL,
  // });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

lumintechApp();