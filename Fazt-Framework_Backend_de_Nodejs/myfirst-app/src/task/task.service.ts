import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto copy';

@Injectable()
export class TaskService {
  private tasks: any[] = [];

  getTasks() {
    return this.tasks;
  }

  getTask(id: number) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      // throw new NotFoundException('Not Found');
    }
    return task;
  }

  createTask(task: CreateTaskDto) {
    console.log(task);
    this.tasks.push({
      ...task,
      id: this.tasks.length + 1,
    });
    return 'crear tarea';
  }

  updateTask(task: UpdateTaskDto) {
    return 'actualizar tarea';
  }

  updateStatusTask() {
    return 'actualizar status de tarea';
  }

  deleteTask() {
    return 'eliminando tarea';
  }
}
