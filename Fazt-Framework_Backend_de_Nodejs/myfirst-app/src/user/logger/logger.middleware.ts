import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express'; // agregamos esto para autocomplete código

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('middleware:', req.originalUrl);

    next();
  }
}
