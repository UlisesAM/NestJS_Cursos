import { Injectable } from '@nestjs/common';
import { CreateTestTableDto } from './dto/create-test_table.dto';
import { UpdateTestTableDto } from './dto/update-test_table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestTableEntity } from './entities/test_table.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TestTableService {
  constructor(
    @InjectRepository(TestTableEntity)
    private testRepo: Repository<TestTableEntity>,
  ) {}

  create(createTestTableDto: CreateTestTableDto) {
    const newRecord = this.testRepo.create(createTestTableDto);
    return this.testRepo.save(newRecord);
  }

  findAll() {
    return this.testRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} testTable`;
  }

  update(id: number, updateTestTableDto: UpdateTestTableDto) {
    return `This action updates a #${id} testTable`;
  }

  remove(id: number) {
    return `This action removes a #${id} testTable`;
  }

  findNotEmpty() {
    return this.testRepo
      .createQueryBuilder('t')
      .where('t.name IS NOT NULL')
      .getMany();
  }
}
