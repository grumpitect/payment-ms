import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeederModule } from './database/seeders/seeder.module';
import { SeederService } from './database/seeders/seeder.service';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(SeederModule);
  const seeder = app.get(SeederService);

  try {
    await seeder.seed();
    logger.log('Seeding complete!');
  } catch (error) {
    logger.error('Seeding failed!');
  } finally {
    app.close();
  }
}
bootstrap();
