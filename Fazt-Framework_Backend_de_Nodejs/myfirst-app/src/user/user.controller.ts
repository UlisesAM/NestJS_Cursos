import {
  Body,
  Controller,
  Get,
  Post,
  // UsePipes,
  // ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  // @UsePipes(new ValidationPipe())
  createUser(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }
}
