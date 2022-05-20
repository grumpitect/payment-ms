import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountLogicService } from '../services/logic/discount.logic.service';
import { ProductDiscountRequestDTO } from '../dtos/product-discount-request.dto';
import { ProductDiscountResponseDTO } from '../dtos/product-discount-response.dto';
import { CheckPolicies } from '../../../common/decorators/CheckPolicies';
import { Subject } from '../../../common/types/subject';
import { Action } from '../../../common/types/action';
import { AppAbility } from '../../../auth/casl-ability.factory';

@ApiTags('payment')
@Controller('discount')
export class DiscountController {
  constructor(private readonly logicService: DiscountLogicService) {}

  @Get('/product')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Subject.Discount),
  )
  async getProductDiscount(
    @Query() dto: ProductDiscountRequestDTO,
  ): Promise<ProductDiscountResponseDTO[]> {
    const dicounts = await this.logicService.getProductDiscount(dto);

    return dicounts;
  }
}
