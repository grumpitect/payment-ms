export enum DiscountSource {
  Product = 'product',
  Category = 'category',
}

export class ProductDiscountResponseDTO {
  discount: number;
  source: DiscountSource;
  category?: string;
}
