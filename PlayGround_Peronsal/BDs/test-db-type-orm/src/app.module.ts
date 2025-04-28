import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: '10.218.231.139',
      port: 1521,
      username: 'uavaloz',
      password: 'uavaloz',
      serviceName: 'TQDEV', // SID de la base de datos (puede ser SERVICE_NAME dependiendo de tu setup)
      entities: [User],
      synchronize: false, // solo en desarrollo, crea tablas automáticamente
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
