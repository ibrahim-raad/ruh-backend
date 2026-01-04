import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { SpecializationOutput } from 'src/domain/specializations/dto/specialization.output';
import { TherapistOutput } from 'src/domain/therapists/dto/therapist.output';

export class TherapistCertificateOutput extends AuditableOutput {
  readonly title: string;
  readonly issuer: string;
  readonly issued_date: Date;
  readonly description?: string;
  readonly specialization_id?: string;
  readonly specialization?: SpecializationOutput;
  readonly therapist_id?: string;
  readonly therapist?: TherapistOutput;
  readonly file_url?: string;
}
