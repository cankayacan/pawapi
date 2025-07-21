import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: true },
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}

bootstrap();
