import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
type UserRole = 'admin' | 'user'; // TODO: Replace with actual user role enum
export const Roles = (permissions: UserRole[] | UserRole) =>
  SetMetadata(ROLES_KEY, permissions);
