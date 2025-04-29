import { RolEntity } from 'src/rol/entities/rol.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'T_USER' })
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'UID_NAME', nullable: true })
  uidName: string;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'ROL_ID' })
  rolId: number;

  @ManyToOne(() => RolEntity, (rol) => rol.usuarios, { eager: true })
  @JoinColumn({ name: 'ROL_ID' }) // Aquí se mapea la columna de la FK
  rolData: RolEntity;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', type: 'timestamp', nullable: true })
  updatedAt: Date;
}
