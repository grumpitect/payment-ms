import { Discount } from '../../common/types/discount';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

const ProductCollectionName = 'products';
@Entity(ProductCollectionName)
export class Product {
  static CollectionName = ProductCollectionName;

  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  code: string;

  @Column(() => Discount)
  discount?: Discount;

  // there should be a default category for a product in case user did not specify the desired category
  @Column()
  defaultCategory: string;

  // we could keep the `_id` field of the category here but it gives us no advantage than keeping a simple string
  // actually keeping the `title` field of the category is more readable for debugging purposes and is as unique as the `_id` field
  // a product can be a member of multiple categories
  @Column()
  categories: string[]; // `category.title`
}
