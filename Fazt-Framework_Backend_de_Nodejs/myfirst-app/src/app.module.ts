import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';
import { PagosModule } from './pagos/pagos.module';

@Module({
  imports: [TaskModule, UserModule, TestModule, PagosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
