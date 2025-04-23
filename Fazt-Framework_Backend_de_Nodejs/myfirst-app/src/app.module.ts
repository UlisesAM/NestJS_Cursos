import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [TaskModule, UserModule, TestModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
