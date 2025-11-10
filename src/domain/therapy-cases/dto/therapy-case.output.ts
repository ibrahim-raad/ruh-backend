import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { TherapyCaseType } from '../shared/therapy-case-type.enum';
import { TherapyCaseStatus } from '../shared/therapy-case-status.enum';
import { PatientOutput } from 'src/domain/patients/dto/patient.output';
import { TherapistOutput } from 'src/domain/therapists/dto/therapist.output';

export class TherapyCaseOutput extends AuditableOutput {
  readonly notes?: string;
  readonly type: TherapyCaseType;
  readonly status: TherapyCaseStatus;
  readonly first_session_at?: Date;
  readonly last_session_at?: Date;
  readonly total_sessions: number;
  readonly patient: PatientOutput;
  readonly therapist: TherapistOutput;
  readonly transferred_to?: TherapyCaseOutput;
  readonly patient_id?: string;
  readonly therapist_id?: string;
  readonly transferred_to_id?: string;
}
