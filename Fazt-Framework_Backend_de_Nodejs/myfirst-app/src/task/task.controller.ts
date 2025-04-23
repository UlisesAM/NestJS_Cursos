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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto copy';

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
  // @UsePipes(new ValidationPipe())
  createTask(@Body() task: CreateTaskDto) {
    return this.taskService.createTask(task);
  }

  @Put()
  updateTask(@Body() task: UpdateTaskDto) {
    return this.taskService.updateTask(task);
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
