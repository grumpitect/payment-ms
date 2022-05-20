import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { SettingKeys, Settings } from '../entities/settings.entity';
import { CategoriesSampleData } from './data/categories';
import { ProductsSampleData } from './data/products';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: MongoRepository<Category>,
    @InjectRepository(Settings)
    private readonly settingsRepository: MongoRepository<Settings>,
  ) {}

  async seed(): Promise<boolean> {
    const isSeeded = await this.settingsRepository.findOne({
      where: {
        key: SettingKeys.IsSeeded,
      },
    });

    if (!isSeeded) {
      await this.categoryRepository.insertMany(CategoriesSampleData);
      await this.productRepository.insertMany(ProductsSampleData);
      await this.settingsRepository.insertOne({
        key: SettingKeys.IsSeeded,
        value: true,
      });

      return true;
    }

    return false;
  }
}
