import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('API de NestJS')
    .setDescription('Curso de NestJS')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory); // ir a http://localhost:3000/swagger

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
