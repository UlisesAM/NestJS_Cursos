import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  getTask() {
    return ['t1', 't2', 't3'];
  }

  createTask() {
    return 'crear tarea';
  }

  updateTask() {
    return 'actualizar tarea';
  }

  deleteTask() {
    return 'eliminando tarea';
  }
}
