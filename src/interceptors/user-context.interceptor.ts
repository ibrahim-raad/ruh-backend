import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  constructor(private readonly clsService: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<{ user: object }>();

    if (request && request.user) {
      this.clsService.set('context', { user: request.user });
    }

    return next.handle();
  }
}
