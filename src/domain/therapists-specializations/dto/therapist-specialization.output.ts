import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { SpecializationOutput } from 'src/domain/specializations/dto/specialization.output';
import { TherapistOutput } from 'src/domain/therapists/dto/therapist.output';

export class TherapistSpecializationOutput extends AuditableOutput {
  readonly therapist_id?: string;
  readonly specialization_id?: string;
  readonly therapist: TherapistOutput;
  readonly specialization: SpecializationOutput;
}
