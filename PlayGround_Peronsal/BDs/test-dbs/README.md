# DB Oracle + Sequelize ORM

> [Official doc](https://docs.nestjs.com/techniques/database#sequelize-integration)

> [readme](doc/mainReadme.md)

**NOTA**: la principal desventaja que note fue que en Oracle me da un probelma al crear un nuevo record en la tabla, y es que el ID del nuevo elemento no me lo esta regresando directamente, lo tengo que sacra de otra variable y pasarla a la respuesta.

## Implementación

1. SequelizeModule en AppModule

```typescript
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/entity/user.model';

@Module({
  imports: [
    UserModule,
    SequelizeModule.forRoot({
      dialect: 'oracle',
      dialectModule: require('oracledb'),
      host: '127.0.0.1',
      port: 1521,
      username: 'user',
      password: 'user_pass',
      database: 'TQDEV',
      models: [User], // Lista de modelos que Sequelize debe cargar
      autoLoadModels: true, // Carga automática de modelos (si están registrados en `forFeature`)
      synchronize: false, // Si está en true, intenta sincronizar el esquema (NO recomendado en producción)
      logging: false, // Desactiva los logs SQL en consolas
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

2. Model

```typescript
// entity/user.model.ts
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
```

3. UserModule Imports

```typescript
// user.module.ts
...
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entity/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
...
```

4. Service - implementación

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAll() {
    return this.userModel.findAll().then((res) => {
      console.log(res);
      return res;
    });
  }

  async create(user: User) {
    const created = await this.userModel.create(user, {
      // returning: true,
    });

    console.log(created.ID);
    created.dataValues.ID = created.ID; // se hace esto ya que el ID retronaba en NULL
    return created.toJSON();
  }
}
```

5. Controller

```typescript
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() user: User) {
    return this.userService.create(user);
  }
}
```
