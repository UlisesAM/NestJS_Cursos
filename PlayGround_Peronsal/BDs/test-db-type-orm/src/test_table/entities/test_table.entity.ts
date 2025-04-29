import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'T_TEST_V2' })
export class TestTableEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'FLAG' })
  flag: boolean;

  @Column({
    name: 'LIST_STR',
    type: 'clob', // o 'varchar2' si el contenido no es muy grande
    transformer: {
      to: (value: string[]) => JSON.stringify(value),
      from: (value: string) => {
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
    },
  })
  list_str: string[];
}
