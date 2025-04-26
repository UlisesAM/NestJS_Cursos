import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/entity/user.model';

@Module({
  imports: [
    UserModule,
    SequelizeModule.forRoot({
      dialect: 'oracle',
      dialectModule: require('oracledb'),
      host: '10.218.231.139',
      port: 1521,
      username: 'uavaloz',
      password: 'uavaloz',
      database: 'TQDEV',
      models: [User],
      autoLoadModels: true,
      synchronize: false,
      logging: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
