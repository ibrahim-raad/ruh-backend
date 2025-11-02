import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { TherapyMode } from '../shared/therapy-mode.enum';
import { UserGender } from 'src/domain/users/shared/user-gender.enum';
import { UserOutput } from 'src/domain/users/dto/user.output';

export class PatientOutput extends AuditableOutput {
  readonly user_id?: string;
  readonly preferred_therapist_gender: UserGender;
  readonly preferred_therapy_mode: TherapyMode;
  readonly provider_customer_id?: string;
  readonly user?: UserOutput;
}
