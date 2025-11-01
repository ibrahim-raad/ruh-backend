import { UserRole } from 'src/domain/users/shared/user-role.enum';

export class JwtPayload {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
}
