import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { User } from 'src/domain/users/entities/user.entity';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  constructor(private readonly clsService: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context
      .switchToHttp()
      .getRequest<{ user: User | undefined }>();

    if (request && request.user) {
      this.clsService.set('user-context', { user: request.user });
    }

    return next.handle();
  }
}
