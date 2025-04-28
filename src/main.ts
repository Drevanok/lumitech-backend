import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common'; // Importa ValidationPipe
import * as dotenv from 'dotenv';

dotenv.config();

async function lumintechApp() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable the global ValidationPipe for the entire app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if there are non-permitted properties
      transform: true, // Transforms the payload to the correct types
      validationError: {
        target: false, // Does not show the original object in the errors
        value: false, // Does not show the invalid value in the errors
      },
    }),
  );

  // app.enableCors({
  //   origin: process.env.FRONT_URL, // por ejemplo: https://app.lumintech.com
  // });
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

lumintechApp();
