import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [
    { id: 1, name: 'ulises' },
    { id: 2, name: 'pao' },
    { id: 3, name: 'mile' },
    { id: 4, name: 'leon' },
  ];

  getUsers() {
    return this.users;
  }
}
