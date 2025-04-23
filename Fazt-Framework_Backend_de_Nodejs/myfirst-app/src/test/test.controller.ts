import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ValidarUserPipe } from './pipes/validar-user/validar-user.pipe';

@Controller('test')
export class TestController {
  @Get('notfound')
  @HttpCode(404)
  notFoundPage() {
    return 'not found page';
  }

  @Get('errorPage')
  @HttpCode(500)
  errorPage() {
    return 'error Route!!';
  }

  @Get('new')
  @HttpCode(201)
  someThing() {
    return 'Something new';
  }

  @Get('ticket/:num')
  getNumber(@Param('num', ParseIntPipe) num: number) {
    return num + 8;
  }

  @Get('active/:status')
  isUserActive(@Param('status', ParseBoolPipe) status: boolean) {
    console.log(typeof status);
    return status;
  }

  @Get('greet')
  greet(@Query(ValidarUserPipe) query: { name: string; age: number }) {
    console.log(typeof query.name); // string
    console.log(typeof query.age); // number
    return `hello ${query.name}, your are ${query.age} old`;
  }
}
