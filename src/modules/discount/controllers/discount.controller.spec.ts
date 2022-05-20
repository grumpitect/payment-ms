import { Test, TestingModule } from '@nestjs/testing';
import {
  DiscountSource,
  ProductDiscountResponseDTO,
} from '../dtos/product-discount-response.dto';
import { DiscountLogicService } from '../services/logic/discount.logic.service';
import { DiscountController } from './discount.controller';

describe('DiscountController', () => {
  let controller: DiscountController;
  let logicService: DiscountLogicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DiscountLogicService,
          useValue: {
            getProductDiscount: jest.fn(),
          },
        },
      ],
      controllers: [DiscountController],
    }).compile();

    logicService = module.get<DiscountLogicService>(DiscountLogicService);
    controller = module.get<DiscountController>(DiscountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the discounts without midification', async () => {
    const result = [
      {
        source: DiscountSource.Product,
        discount: -1,
      },
    ];

    jest
      .spyOn(logicService, 'getProductDiscount')
      .mockImplementation(
        (): Promise<ProductDiscountResponseDTO[]> => Promise.resolve(result),
      );

    expect(
      await controller.getProductDiscount({
        productCode: 'Not Important',
      }),
    ).toBe(result);
  });
});
