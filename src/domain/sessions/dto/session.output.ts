import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { SessionType } from '../shared/session-type.enum';
import { TherapyCaseOutput } from 'src/domain/therapy-cases/dto/therapy-case.output';
import { SessionStatus } from '../shared/session-status.enum';

export class SessionOutput extends AuditableOutput {
  readonly therapy_case_id?: string;
  readonly therapy_case?: TherapyCaseOutput;
  readonly start_time: Date;
  readonly end_time: Date;
  readonly actual_start_time?: Date;
  readonly actual_end_time?: Date;
  readonly link?: string;
  readonly audio_link?: string;
  readonly patient_feedback?: string;
  readonly type: SessionType;
  readonly status: SessionStatus;
}
