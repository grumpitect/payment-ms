import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountDataService } from './services/data/discount.data.service';
import { DiscountLogicService } from './services/logic/discount.logic.service';
import { DiscountController } from './controllers/discount.controller';
import { Product } from '../../database/entities/product.entity';
import { Category } from '../../database/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [DiscountDataService, DiscountLogicService],
  controllers: [DiscountController],
})
export class DiscountModule {}
