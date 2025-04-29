# TypeORM + DB Oracle

> [Official doc](https://github.com/typeorm/typeorm)

> [NestJs doc](https://docs.nestjs.com/techniques/database)

> [main reame](doc/mainReadme.md)

# Basico

## 1. Instalación básica

```bash
npm install @nestjs/typeorm typeorm oracledb
```

- `@nestjs/typeorm`: integración de TypeORM con NestJS

- `typeorm`: el ORM

- `oracledb`: cliente Node.js para conectarse a bases de datos Oracle. `pg` para Postgres

## 2. Configuración DB en `AppModule`

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'localhost',
      port: 1521,
      username: 'usuario_oracle',
      password: 'contraseña_oracle',
      serviceName: 'TQDEV', // o SID de la base de datos (puede ser sid dependiendo de tu setup)
      entities: [User], // lista de clases que representan tablas
      synchronize: false, // true solo en desarrollo, crea tablas automáticamente
    }),
    UserModule,
  ],
})
export class AppModule {}
```

## 3. Entity - Creación

Estos los podemos crear dentro de un modulo que los usara o que tenga relacionado su lógica

Hay dos patrones de ORM que se pueden usar (para el ejemplo usamos Data Mapper)

- [Active Record](https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md#what-is-the-active-record-pattern)
- [Data Mapper](https://github.com/typeorm/typeorm/blob/master/docs/active-record-data-mapper.md#what-is-the-data-mapper-pattern)

ejemplos de entities [userEntity](src/user/entities/user.entity.ts), [testEntity](src/test_table/entities/test_table.entity.ts)

```typescript
// src/user/entity/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'T_USER' })
export class User {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'UID_NAME' })
  uidName: string;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'ROL_ID' })
  rolId: number;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', type: 'timestamp', nullable: true })
  updatedAt: Date;
}
```

Explicación:

- `@Entity()`: dice que esta clase será una tabla en Oracle.
- `@PrimaryGeneratedColumn()`: Oracle creará un ID único automático.
- `@Column()`: un campo normal en la tabla.
- `@CreateDateColumn`, `@UpdateDateColumn`: Nest/TypeORM llena automáticamente estas fechas en **INSERT** y **UPDATE**

## 4. Module + Service + DTO + Controller

### Module

```typescript
// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

Explicación:

- `TypeOrmModule.forFeature([User])`: habilita la inyección del repositorio de User en el servicio.

### Service

Usando el Repository pattern

```typescript
// user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(userDTO: CreateUserDto) {
    const user = this.userRepository.create(userDTO);
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne() {
    return await this.userRepository.findOneBy({
      name: 'ulises',
      uidName: 'uid10903',
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(id, updateUserDto);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { message: 'User updated successfully' };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userRepository.remove(user);
  }
}
```

Explicación:

- Usamos `@InjectRepository(User)` para acceder fácilmente a la tabla User.

### DTOs

```typescript
// user/dto/create.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  uidName: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  rolId: number;
}
```

```typescript
// user/dto/update.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

### Controller

```typescript
// user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
```

# QueryBuilder

```typescript
const usuarios = await this.usuarioRepo
  .createQueryBuilder('usuario')
  .where('usuario.nombre = :nombre', { nombre: 'Juan' })
  .getMany();
```

# Relaciones (OneToMany, ManyToOne)

Ejemplo:
2 tablas User y Roles, muchos usuarios tienen 1 rol (muchos a 1)

```typescript
// user.entity.ts
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

  @Column({ name: 'NAME' })
  name: string;

  // ID del ROL
  @Column({ name: 'ROL_ID' })
  rolId: number;

  // nueva propiedad con el objeto de ROL
  @ManyToOne(() => RolEntity, (rol) => rol.usuarios, { eager: true })
  @JoinColumn({ name: 'ROL_ID' }) // Aquí se mapea la columna de la FK
  rolData: RolEntity;
}
```

```typescript
// roles.entity.ts
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'T_ROL_TYPE' })
export class RolEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NAME' })
  name: string;

  @OneToMany(() => UserEntity, (user) => user.rolData)
  usuarios: UserEntity[];
}
```

Explicación

- `@JoinColumn()` se coloca en la entidad que tiene la clave foránea (FK). Solo se necesita en un lado de la relación.
- `eager: true` : en UserEntity usamos esta bandera. Configura la relación para cargar automáticamente en cada request.  
  Si no estuvieras usando `eager: true`, tendrías que hacer lo siguiente:

```typescript
async findAll(): Promise<UserEntity[]> {
  return this.userRepository.find({
    relations: ['rolData'], // Incluye la relación manualmente
  });
}
```

Para este caso se separo en un parámetro nuevo (**rolData**) la relación del ROL_ID con un objeto de RolEntity para simplificar el INSERT o UPDATE de usuarios, ya que no necesito estar modificando o creando un rol nuevo cada que creo un usuario, solo necesito su relación para obtener los datos del rol.  
Sí hubiera usado la misma columna como columna de de relación a roles, se tendría que modificar el servicio de crear/actualizar usuarios para primero buscar el objeto del rol y después pasarlo al JSON que se pasa al userRepository, algo asi:

```typescript
// service
async create(createUserDto: CreateUserDto): Promise<UserEntity> {
  const rol = await this.rolRepository.findOneBy({ id: createUserDto.rolId });

  if (!rol) {
    throw new Error('Rol no encontrado');
  }

  const newUser = this.userRepository.create({
    uidName: createUserDto.uidName,
    name: createUserDto.name,
    rol: rol, // asignas el objeto RolEntity, no el ID directamente
  });

  return this.userRepository.save(newUser);
}
```
