import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from './decorators/permissions.decorator';
// import { UserRole } from 'src/domain/users/shared/user-role.enum';

type UserRole = 'admin' | 'user'; // TODO: Replace with actual user role enum

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<UserRole[] | UserRole>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user: { role: UserRole };
    }>();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    if (user.role === 'admin') {
      return true;
    }

    if (Array.isArray(requiredPermissions)) {
      return requiredPermissions.includes(user.role);
    }

    return user.role === requiredPermissions;
  }
}
