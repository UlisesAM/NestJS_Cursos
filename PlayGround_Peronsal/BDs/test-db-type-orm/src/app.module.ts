import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TestTableModule } from './test_table/test_table.module';
import { User } from './user/entities/user.entity';
import { TestTableEntity } from './test_table/entities/test_table.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: '10.218.231.139',
      port: 1521,
      username: 'uavaloz',
      password: 'uavaloz',
      serviceName: 'TQDEV', // SID de la base de datos (puede ser SERVICE_NAME dependiendo de tu setup)
      entities: [User, TestTableEntity],
      synchronize: false, // solo en desarrollo, crea tablas automáticamente
    }),
    UserModule,
    TestTableModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
