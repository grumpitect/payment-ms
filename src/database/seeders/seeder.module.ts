import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Settings } from '../entities/settings.entity';
import { EnvModule } from '../../env/env.module';
import { EnvService } from '../../env/env.service';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => env.mongo,
    }),
    TypeOrmModule.forFeature([Product, Category, Settings]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
