import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    console.log(req.headers); // out: /test/greet?name=ulises&age=22

    if (req.url === '/test/greet') return false; // termina request en error

    if(!req.headers['validar']) return false; // termina request en error

    return true; // continua con la lógica
  }
}
