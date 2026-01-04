import { CurrencyOutput } from 'src/domain/currencies/dto/currency.output';
import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { SpecializationOutput } from 'src/domain/specializations/dto/specialization.output';
import { TherapistCertificateOutput } from 'src/domain/therapists-certificates/dto/therapist-certificate.output';
import { UserOutput } from 'src/domain/users/dto/user.output';

export class TherapistOutput extends AuditableOutput {
  readonly user_id?: string;
  readonly user?: UserOutput;
  readonly bio?: string;
  readonly years_of_experience?: number;
  readonly rate_per_hour?: number;
  readonly currency?: CurrencyOutput;
  readonly currency_id?: string;
  readonly specializations?: SpecializationOutput[];
  readonly certificates?: TherapistCertificateOutput[];
}
