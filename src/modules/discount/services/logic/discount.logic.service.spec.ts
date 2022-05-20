import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../../../../database/entities/product.entity';
import { Category } from '../../../../database/entities/category.entity';
import { DiscountType } from '../../../../common/types/discount';
import {
  DiscountSource,
  ProductDiscountResponseDTO,
} from '../../dtos/product-discount-response.dto';
import {
  CategoryWithParents,
  DiscountDataService,
} from '../data/discount.data.service';
import { DiscountLogicService } from './discount.logic.service';
import { NoDiscountValue } from '../../../../common/constants';

// TODO: refactor tests

describe('DiscountLogicService', () => {
  let dataService: DiscountDataService;
  let logicService: DiscountLogicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountLogicService,
        {
          provide: DiscountDataService,
          useValue: {
            findProductByCode: jest.fn(),
            findCategoriesWithParentsByTitle: jest.fn(),
          },
        },
      ],
    }).compile();

    dataService = module.get<DiscountDataService>(DiscountDataService);
    logicService = module.get<DiscountLogicService>(DiscountLogicService);
  });

  it('should be defined', () => {
    expect(logicService).toBeDefined();
  });

  it('should throw not found exception if the product is not found', async () => {
    jest
      .spyOn(dataService, 'findProductByCode')
      .mockImplementation((): Promise<Product> => Promise.resolve(null));

    try {
      await logicService.getProductDiscount({
        productCode: 'Not Important',
      });

      expect(true).toBe(false);
    } catch (ex) {
      expect(ex).toBeInstanceOf(NotFoundException);
    }
  });

  it("should return product's discount if its present", async () => {
    const product: Product = {
      _id: null,
      code: '0000',
      title: 'mock product',
      categories: ['a', 'b'],
      defaultCategory: 'a',
      discount: {
        type: DiscountType.Percent,
        value: 0.99,
      },
    };
    const expectedResult: ProductDiscountResponseDTO[] = [
      {
        source: DiscountSource.Product,
        discount: product.discount.value,
      },
    ];

    jest
      .spyOn(dataService, 'findProductByCode')
      .mockImplementation((): Promise<Product> => Promise.resolve(product));

    expect(
      await logicService.getProductDiscount({
        productCode: 'Not Important',
      }),
    ).toStrictEqual(expectedResult);
  });

  it("should use product's defaultCategory if the product does not have a direct discount", async () => {
    const product: Product = {
      _id: null,
      code: '0000',
      title: 'mock product',
      categories: ['a', 'b'],
      defaultCategory: 'a',
    };
    const category: Category = {
      _id: null,
      parent: null,
      title: 'a',
      discount: {
        type: DiscountType.Percent,
        value: 0.46,
      },
    };
    const categoriesWithParents: CategoryWithParents[] = [
      {
        ...category,
        sortedCategoryHierarchy: [
          {
            ...category,
            order: 1,
          },
        ],
      },
    ];
    const expectedResult: ProductDiscountResponseDTO[] = [
      {
        source: DiscountSource.Category,
        discount: category.discount.value,
        category: category.title,
      },
    ];

    jest
      .spyOn(dataService, 'findProductByCode')
      .mockImplementation((): Promise<Product> => Promise.resolve(product));
    jest
      .spyOn(dataService, 'findCategoriesWithParentsByTitle')
      .mockImplementation(
        (): Promise<CategoryWithParents[]> =>
          Promise.resolve(categoriesWithParents),
      );

    expect(
      await logicService.getProductDiscount({
        productCode: 'Not Important',
      }),
    ).toStrictEqual(expectedResult);
  });

  it('should return the discount of the first category in the hierarchy with a discount value', async () => {
    const product: Product = {
      _id: null,
      code: '0000',
      title: 'mock product',
      categories: ['b', 'c'],
      defaultCategory: 'c',
    };
    const firstCategory: Category = {
      _id: null,
      parent: 'b',
      title: 'c',
    };
    const secondCategory: Category = {
      _id: null,
      parent: 'a',
      title: 'b',
      discount: {
        type: DiscountType.Percent,
        value: 0.23,
      },
    };
    const thirdCategory: Category = {
      _id: null,
      parent: null,
      title: 'a',
      discount: {
        type: DiscountType.Percent,
        value: 0.74,
      },
    };
    const categoriesWithParents: CategoryWithParents[] = [
      {
        ...firstCategory,
        sortedCategoryHierarchy: [
          {
            ...firstCategory,
            order: 1,
          },
          {
            ...secondCategory,
            order: 2,
          },
          {
            ...thirdCategory,
            order: 3,
          },
        ],
      },
    ];
    const expectedResult: ProductDiscountResponseDTO[] = [
      {
        source: DiscountSource.Category,
        discount: secondCategory.discount.value,
        category: firstCategory.title,
      },
    ];

    jest
      .spyOn(dataService, 'findProductByCode')
      .mockImplementation((): Promise<Product> => Promise.resolve(product));
    jest
      .spyOn(dataService, 'findCategoriesWithParentsByTitle')
      .mockImplementation(
        (): Promise<CategoryWithParents[]> =>
          Promise.resolve(categoriesWithParents),
      );

    expect(
      await logicService.getProductDiscount({
        productCode: 'Not Important',
      }),
    ).toStrictEqual(expectedResult);
  });

  it("should return all the discounts of the product's categories if useAllCategories is provided", async () => {
    const product: Product = {
      _id: null,
      code: '0000',
      title: 'mock product',
      categories: ['b', 'c'],
      defaultCategory: 'c',
    };
    const secondCategory: Category = {
      _id: null,
      parent: 'a',
      title: 'b',
      discount: {
        type: DiscountType.Percent,
        value: 0.23,
      },
    };
    const thirdCategory: Category = {
      _id: null,
      parent: null,
      title: 'a',
      discount: {
        type: DiscountType.Percent,
        value: 0.74,
      },
    };
    const categoriesWithParents: CategoryWithParents[] = [
      {
        ...secondCategory,
        sortedCategoryHierarchy: [
          {
            ...secondCategory,
            order: 1,
          },
          {
            ...thirdCategory,
            order: 2,
          },
        ],
      },
      {
        ...thirdCategory,
        sortedCategoryHierarchy: [
          {
            ...thirdCategory,
            order: 1,
          },
        ],
      },
    ];
    const expectedResult: ProductDiscountResponseDTO[] = [
      {
        source: DiscountSource.Category,
        discount: secondCategory.discount.value,
        category: secondCategory.title,
      },
      {
        source: DiscountSource.Category,
        discount: thirdCategory.discount.value,
        category: thirdCategory.title,
      },
    ];

    jest
      .spyOn(dataService, 'findProductByCode')
      .mockImplementation((): Promise<Product> => Promise.resolve(product));
    jest
      .spyOn(dataService, 'findCategoriesWithParentsByTitle')
      .mockImplementation(
        (): Promise<CategoryWithParents[]> =>
          Promise.resolve(categoriesWithParents),
      );

    expect(
      await logicService.getProductDiscount({
        productCode: 'Not Important',
        useAllCategories: true,
      }),
    ).toStrictEqual(expectedResult);
  });

  it(`should return "${NoDiscountValue}" if specified categories are not found`, async () => {
    const product: Product = {
      _id: null,
      code: '0000',
      title: 'mock product',
      categories: ['a', 'b'],
      defaultCategory: 'c',
    };
    const categoriesWithParents: CategoryWithParents[] = [];
    const expectedResult: ProductDiscountResponseDTO[] = [
      {
        source: DiscountSource.Product,
        discount: NoDiscountValue,
      },
    ];

    jest
      .spyOn(dataService, 'findProductByCode')
      .mockImplementation((): Promise<Product> => Promise.resolve(product));
    jest
      .spyOn(dataService, 'findCategoriesWithParentsByTitle')
      .mockImplementation(
        (): Promise<CategoryWithParents[]> =>
          Promise.resolve(categoriesWithParents),
      );

    expect(
      await logicService.getProductDiscount({
        productCode: 'Not Important',
        specificCategories: ['no_cat_1', 'no_cat_2'],
      }),
    ).toStrictEqual(expectedResult);
  });

  it('should return specific category discounts if specificCategories is provided', async () => {
    const product: Product = {
      _id: null,
      code: '0000',
      title: 'mock product',
      categories: ['a', 'c'],
      defaultCategory: 'c',
    };
    const thirdCategory: Category = {
      _id: null,
      parent: null,
      title: 'a',
      discount: {
        type: DiscountType.Percent,
        value: 0.74,
      },
    };
    const categoriesWithParents: CategoryWithParents[] = [
      {
        ...thirdCategory,
        sortedCategoryHierarchy: [
          {
            ...thirdCategory,
            order: 1,
          },
        ],
      },
    ];
    const expectedResult: ProductDiscountResponseDTO[] = [
      {
        source: DiscountSource.Category,
        discount: thirdCategory.discount.value,
        category: thirdCategory.title,
      },
    ];

    jest
      .spyOn(dataService, 'findProductByCode')
      .mockImplementation((): Promise<Product> => Promise.resolve(product));
    jest
      .spyOn(dataService, 'findCategoriesWithParentsByTitle')
      .mockImplementation(
        (): Promise<CategoryWithParents[]> =>
          Promise.resolve(categoriesWithParents),
      );

    expect(
      await logicService.getProductDiscount({
        productCode: 'Not Important',
        specificCategories: ['no_cat_1', 'a'],
      }),
    ).toStrictEqual(expectedResult);
  });
});
