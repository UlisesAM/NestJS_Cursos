# TypeORM + DB Oracle

> [Official doc](https://github.com/typeorm/typeorm)

> [NestJs doc](https://docs.nestjs.com/techniques/database)

> [main reame](doc/mainReadme.md)

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
export class CreateUserDto {
  id: number;
  uidName: string;
  name: string;
  rolId: number;
  createdAt: Date;
  updatedAt: Date;
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
