import { LanguageOutput } from 'src/domain/languages/dto/language.output';
import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { UserOutput } from 'src/domain/users/dto/user.output';

export class UserSpokenLanguageOutput extends AuditableOutput {
  readonly user_id?: string;
  readonly user?: UserOutput;
  readonly language_id?: string;
  readonly language?: LanguageOutput;
  readonly is_primary: boolean;
}
