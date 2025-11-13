import { SessionOutput } from 'src/domain/sessions/dto/session.output';
import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { UserOutput } from 'src/domain/users/dto/user.output';

export class SessionChatOutput extends AuditableOutput {
  readonly message: string;
  readonly session_id?: string;
  readonly user_id?: string;
  readonly user: UserOutput;
  readonly session: SessionOutput;
}
