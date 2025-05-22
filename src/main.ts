import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

dotenv.config();

async function lumintechApp() {
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.use(cookieParser());

  // Pipes globales de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  //Enable CORS with credentials to allow secure cross-origin cookies (web)
  app.enableCors({
    origin: process.env.FRONT_URL, // example: 'https://app.lumintech.com'
    credentials: true, // para permitir envío de cookies
  });
    
  const PORT = process.env.PORT ?? 3001;
  const HOST = '192.168.0.25';

  await app.listen(PORT, HOST);

  console.log(`Servidor NestJS iniciado en http://${HOST}:${PORT}`);
}

lumintechApp();
