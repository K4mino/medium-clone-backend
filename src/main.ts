import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(AppModule,appOptions);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
