import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { validador } = req.headers;
    if (!validador) {
      throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
    }

    if (validador !== 'xyz') {
      throw new HttpException('Prohibido', HttpStatus.FORBIDDEN);
    }

    next();
  }
}
