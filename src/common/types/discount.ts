import { Column } from 'typeorm';

export enum DiscountType {
  Percent = 'percent',
}

export class Discount {
  @Column({ enum: DiscountType })
  type: DiscountType; // just wanted to future proof discounting

  @Column()
  value: number;
}
