import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Product } from '../../../../database/entities/product.entity';
import { Category } from '../../../../database/entities/category.entity';

export type OrderedCategory = Category & {
  order: number;
};

export type CategoryWithParents = Category & {
  sortedCategoryHierarchy: OrderedCategory[];
};

@Injectable()
export class DiscountDataService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: MongoRepository<Category>,
  ) {}

  async findProductByCode(code: string): Promise<Product> {
    const product = this.productRepository.findOne({
      where: {
        code,
      },
    });

    return product;
  }

  async findCategoriesWithParentsByTitle(
    categoryTitles: string[],
  ): Promise<CategoryWithParents[]> {
    const pipeline = [
      {
        $match: {
          title: {
            $in: categoryTitles,
          },
        },
      },
      {
        $graphLookup: {
          from: Category.CollectionName,
          startWith: '$title', // I'm using `title` here to include the starting category as well, so the hierarchy will include *all* the categories
          connectFromField: 'parent',
          connectToField: 'title',
          depthField: 'order',
          as: 'parentCategories',
        },
      },
      // all of this is for sorting the parents by order which can be done using $sortArray
      // but because $sortArray is added in MongoDB 5.2 we are not using it here.
      // start of `parentCategories` array sort
      {
        $unwind: {
          path: '$parentCategories',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          'parentCategories.order': 1,
        },
      },
      {
        $group: {
          _id: '$_id',
          updatedCategory: {
            $first: '$$ROOT',
          },
          parentCategories: {
            $push: '$parentCategories',
          },
        },
      },
      {
        $set: {
          'updatedCategory.sortedCategoryHierarchy': '$parentCategories',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$updatedCategory',
        },
      },
      // end of `parentCategories` array sort
    ];

    const result = await this.categoryRepository
      .aggregate<CategoryWithParents>(pipeline)
      .toArray();

    return result;
  }
}
