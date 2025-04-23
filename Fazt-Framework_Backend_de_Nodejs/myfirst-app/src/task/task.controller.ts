import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/hi')
  sayHi() {
    return 'hello';
  }

  @Get()
  getTasks(@Query() query: any) {
    console.log(query);
    return this.taskService.getTasks();
  }

  @Get('/:id')
  getTask(@Param('id') ID: string) {
    return this.taskService.getTask(parseInt(ID));
  }

  @Post()
  createTask(@Body() task: any) {
    return this.taskService.createTask(task);
  }

  @Put()
  updateTask() {
    return this.taskService.updateTask();
  }

  @Patch()
  updateStatusOfTask() {
    return this.taskService.updateStatusTask();
  }

  @Delete()
  deleteTask() {
    return this.taskService.deleteTask();
  }
}
