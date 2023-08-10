import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  return app;
}

async function run() {
  const nestApp = await bootstrap();
  await nestApp.listen(3007);
}

run();
