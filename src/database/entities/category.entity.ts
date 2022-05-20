import { Discount } from '../../common/types/discount';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

const CategoryCollectionName = 'categories';
@Entity(CategoryCollectionName)
export class Category {
  static CollectionName = CategoryCollectionName;

  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  parent: string;

  @Column(() => Discount)
  discount?: Discount;
}
