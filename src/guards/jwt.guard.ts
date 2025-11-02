import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './decorators/public-route.decorator';
import { User } from 'src/domain/users/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly logger = new Logger(JwtAuthGuard.name),
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<User>(err, user: User, info) {
    if (err || !user) {
      // TODO: Remove this after testing
      // return new User();
      this.logger.error(
        `Error in handleRequest: ${(err as Error)?.message || (info as Error)?.message}`,
      );
      throw err || new UnauthorizedException((info as Error)?.message);
    }
    return user;
  }
}
