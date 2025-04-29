import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'T_ROL_TYPE' })
export class RolEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NAME' })
  name: string;

  @Column()
  DESCRIPTION: string;

  @OneToMany(() => UserEntity, (user) => user.rolData)
  usuarios: UserEntity[];
}
