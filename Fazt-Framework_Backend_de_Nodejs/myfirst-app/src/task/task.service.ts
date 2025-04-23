import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  private tasks: {
    title: string;
    status: boolean;
    id: number;
  }[] = [];

  getTasks() {
    return this.tasks;
  }

  getTask(id: number) {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(task: any) {
    console.log(task);
    this.tasks.push({
      ...task,
      id: this.tasks.length + 1,
    });
    return 'crear tarea';
  }

  updateTask() {
    return 'actualizar tarea';
  }

  updateStatusTask() {
    return 'actualizar status de tarea';
  }

  deleteTask() {
    return 'eliminando tarea';
  }
}
