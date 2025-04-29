import { Module } from '@nestjs/common';
import { TestTableService } from './test_table.service';
import { TestTableController } from './test_table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestTableEntity } from './entities/test_table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestTableEntity])],
  controllers: [TestTableController],
  providers: [TestTableService],
})
export class TestTableModule {}
