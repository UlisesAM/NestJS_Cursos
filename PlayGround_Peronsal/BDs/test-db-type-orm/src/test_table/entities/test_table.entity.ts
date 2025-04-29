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
      // convierte el array de JS a JSON string para guardarlo en la base.
      to: (value: string[]) => JSON.stringify(value),

      // convierte el JSON string que viene de Oracle en un array.
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
