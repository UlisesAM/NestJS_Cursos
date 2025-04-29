import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestTableService } from './test_table.service';
import { CreateTestTableDto } from './dto/create-test_table.dto';
import { UpdateTestTableDto } from './dto/update-test_table.dto';

@Controller('test-table')
export class TestTableController {
  constructor(private readonly testTableService: TestTableService) {}

  @Post()
  create(@Body() createTestTableDto: CreateTestTableDto) {
    return this.testTableService.create(createTestTableDto);
  }

  @Get()
  findAll() {
    return this.testTableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testTableService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestTableDto: UpdateTestTableDto) {
    return this.testTableService.update(+id, updateTestTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testTableService.remove(+id);
  }
}
