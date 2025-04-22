import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('/all')
  getAllTask() {
    return this.taskService.getTask();
  }

  @Post()
  createTask() {
    return this.taskService.createTask();
  }

  @Put(':id')
  updateTask() {
    return this.taskService.updateTask();
  }

  @Delete()
  deleteTask() {
    return this.taskService.deleteTask();
  }
}
