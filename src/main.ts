import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SeederService } from './database/seeders/seeder.service';
import { EnvService } from './env/env.service';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const env = app.get(EnvService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  if (env.autoSeed) {
    const seeder = app.get(SeederService);

    try {
      const isSeeded = await seeder.seed();
      if (isSeeded) {
        logger.log('Seeding complete!');
      }
    } catch (error) {
      logger.error('Seeding failed!');
    }
  }

  const config = new DocumentBuilder()
    .setTitle('Payment Microservice')
    .setVersion('1.0')
    .addTag('payment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(env.httpPort);

  logger.log(`Application listening on port ${env.httpPort}`);
}
bootstrap();
