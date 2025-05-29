import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import { SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function lumintechApp() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(cookieParser());

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

  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
  });


  const yamlPath = path.join(__dirname, '..', 'swagger', 'swagger.yaml');


  const swaggerDocument = yaml.load(
    fs.readFileSync(yamlPath, 'utf8'),
  ) as OpenAPIObject;

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  const PORT = process.env.PORT ?? 3000;
  const HOST = '192.168.0.25';

  await app.listen(PORT, HOST);
  console.log(`Servidor NestJS iniciado en http://${HOST}:${PORT}`);
  console.log(`Swagger disponible en http://${HOST}:${PORT}/api-docs`);
}

lumintechApp();
