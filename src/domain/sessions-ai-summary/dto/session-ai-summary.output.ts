import { SessionOutput } from 'src/domain/sessions/dto/session.output';
import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class SessionAiSummaryOutput extends AuditableOutput {
  readonly session_id?: string;
  readonly session?: SessionOutput;
  readonly summary: string;
}
