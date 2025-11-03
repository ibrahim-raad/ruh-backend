import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { UserRole } from '../shared/user-role.enum';
import { UserGender } from '../shared/user-gender.enum';
import { CountryOutput } from 'src/domain/countries/dto/country.output';
import { UserStatus } from '../shared/user-status.enum';
import { UserEmailStatus } from '../shared/user-email-status.enum';

export class UserOutput extends AuditableOutput {
  readonly full_name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly gender: UserGender;
  readonly country?: CountryOutput;
  readonly country_id?: string;
  readonly date_of_birth?: Date;
  readonly profile_url?: string;
  readonly status: UserStatus;
  readonly email_status: UserEmailStatus;
  readonly access_token?: string;
  readonly refresh_token?: string;
}
