import { Injectable, NotFoundException } from '@nestjs/common';
import { NoDiscountValue } from '../../../../common/constants';
import {
  CategoryWithParents,
  DiscountDataService,
} from '../data/discount.data.service';
import { ProductDiscountRequestDTO } from '../../dtos/product-discount-request.dto';
import {
  DiscountSource,
  ProductDiscountResponseDTO,
} from '../../dtos/product-discount-response.dto';

@Injectable()
export class DiscountLogicService {
  constructor(private readonly dataService: DiscountDataService) {}

  private async getCategoryDiscounts(
    categories: CategoryWithParents[],
  ): Promise<ProductDiscountResponseDTO[]> {
    const discounts = categories.map((category): ProductDiscountResponseDTO => {
      const categoryWithDisCount = category.sortedCategoryHierarchy.find(
        (category) => category.discount,
      );

      let discountValue = NoDiscountValue; // default value
      if (categoryWithDisCount) {
        discountValue = categoryWithDisCount.discount.value;
      }

      return {
        source: DiscountSource.Category,
        discount: discountValue,
        category: category.title,
      };
    });

    return discounts;
  }

  async getProductDiscount({
    productCode,
    useAllCategories = false,
    specificCategories = [],
  }: ProductDiscountRequestDTO): Promise<ProductDiscountResponseDTO[]> {
    const product = await this.dataService.findProductByCode(productCode);

    if (!product) {
      throw new NotFoundException(
        `Product with code "${productCode}" not found`,
      );
    }

    if (product.discount) {
      return [
        {
          source: DiscountSource.Product,
          discount: product.discount.value,
        },
      ];
    }

    let categoryTitles = [product.defaultCategory];
    if (useAllCategories) {
      categoryTitles = product.categories;
    } else if (specificCategories.length) {
      categoryTitles = specificCategories;
    }

    const categories = await this.dataService.findCategoriesWithParentsByTitle(
      categoryTitles,
    );
    const discounts = await this.getCategoryDiscounts(categories);

    // if we can not find any matching categories then return with the default response
    if (discounts.length === 0) {
      discounts.push({
        source: DiscountSource.Product,
        discount: NoDiscountValue,
      });
    }

    return discounts;
  }
}
