import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { TherapistTransferRequestStatus } from '../shared/therapist-transfer-request-status.enum';
import { TherapistOutput } from 'src/domain/therapists/dto/therapist.output';
import { PatientOutput } from 'src/domain/patients/dto/patient.output';
import { TherapyCaseOutput } from 'src/domain/therapy-cases/dto/therapy-case.output';

export class TherapistTransferRequestOutput extends AuditableOutput {
  readonly transfer_reason: string;
  readonly status: TherapistTransferRequestStatus;
  readonly status_reason?: string;
  readonly therapist_id?: string;
  readonly patient_id?: string;
  readonly from_therapy_case_id?: string;
  readonly therapist?: TherapistOutput;
  readonly patient?: PatientOutput;
  readonly from_therapy_case?: TherapyCaseOutput;
}
