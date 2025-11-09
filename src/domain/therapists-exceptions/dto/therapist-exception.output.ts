import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { TherapistOutput } from 'src/domain/therapists/dto/therapist.output';

export class TherapistExceptionOutput extends AuditableOutput {
  readonly date: Date;
  readonly is_available: boolean;
  readonly start_time: string;
  readonly end_time: string;
  readonly reason?: string;
  readonly therapist_id?: string;
  readonly therapist: TherapistOutput;
}
