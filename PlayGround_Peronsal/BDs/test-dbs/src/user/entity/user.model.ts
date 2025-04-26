import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'T_USER' })
export class User extends Model<User> {
  @Column({
    field: 'ID',
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  ID: number;

  @Column
  UID_NAME: string;

  @Column
  NAME: string;

  @Column
  ROL_ID: number;

  @Column
  @CreatedAt
  CREATED_AT?: Date;

  @Column
  @UpdatedAt
  UPDATED_AT?: Date;
}
