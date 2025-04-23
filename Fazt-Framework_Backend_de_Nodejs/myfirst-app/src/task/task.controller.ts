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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/hi')
  @ApiOperation({ summary: 'endpoint para decir hola' })
  @ApiResponse({ status: 200, description: 'Retorna un string' })
  sayHi() {
    return 'hello';
  }

  @Get()
  getTasks(@Query() query: any) {
    console.log(query);
    return this.taskService.getTasks();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Ver una tarea por id' })
  @ApiResponse({ status: 200, description: 'retorna una tarea' })
  @ApiResponse({ status: 404, description: 'not found' })
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
