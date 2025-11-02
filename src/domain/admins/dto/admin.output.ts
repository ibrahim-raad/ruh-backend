import { UserOutput } from 'src/domain/users/dto/user.output';
import { AdminRole } from '../shared/admin-role.enum';
import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class AdminOutput extends UserOutput {
  readonly admin_role: AdminRole;
}

export class AdminWithUserOutput extends AuditableOutput {
  readonly user: UserOutput;
  readonly admin_role: AdminRole;
  readonly user_id?: string;
}
