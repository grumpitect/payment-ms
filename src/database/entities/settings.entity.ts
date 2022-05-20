import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export enum SettingKeys {
  IsSeeded = 'is_seeded',
}

const SettingsCollectionName = 'settings';
@Entity(SettingsCollectionName)
export class Settings {
  static CollectionName = SettingsCollectionName;

  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ enum: SettingKeys })
  key: SettingKeys;

  @Column()
  value: object;
}
