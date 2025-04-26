import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entity/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAll() {
    return this.userModel.findAll().then((res) => {
      console.log(res);
      return res;
    });
  }

  async create(user: User) {
    const created = await this.userModel
      .create(user, {
        // returning: true,
      })
      .then((value) => {
        value.dataValues.ID = value.ID;
        return value;
      });

    console.log(created.ID);
    // await created.reload(); // aquí se hace un SELECT por PK y carga el ID
    return created.toJSON();
  }
}
