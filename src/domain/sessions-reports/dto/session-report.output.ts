import { SessionOutput } from 'src/domain/sessions/dto/session.output';
import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class SessionReportOutput extends AuditableOutput {
  readonly overview?: string;
  readonly diagnosis: string;
  readonly recommendations: string;
  readonly next_steps: string;
  readonly progress_score: number;
  readonly ai_assisted?: boolean;
  readonly is_finalized?: boolean;
  readonly session_id?: string;
  readonly session?: SessionOutput;
}
