import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { StringToArray } from '../../../utils/string-to-array';

export class ProductDiscountRequestDTO {
  @IsString()
  @IsNotEmpty()
  productCode: string;

  // @IsNumber()
  // @IsNotEmpty()
  // invoiceAmount: number;

  @IsBoolean()
  @IsOptional()
  useAllCategories?: boolean;

  @IsOptional()
  @Transform(({ value }) => StringToArray(value))
  specificCategories?: string[];
}
