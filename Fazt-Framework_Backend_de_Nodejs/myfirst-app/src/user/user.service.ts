import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private users: any[] = [
    { id: 1, name: 'ulises' },
    { id: 2, name: 'pao' },
    { id: 3, name: 'mile' },
    { id: 4, name: 'leon' },
  ];

  getUsers() {
    return this.users;
  }

  create(user: CreateUserDto) {
    this.users.push({
      id: this.users.length + 1,
      ...user,
    });
    return 'success';
  }
}
