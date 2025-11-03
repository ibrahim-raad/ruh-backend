import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { QuestionnaireType } from '../shared/questionnaire-type.enum';
import { UserOutput } from 'src/domain/users/dto/user.output';

export class QuestionnaireOutput extends AuditableOutput {
  readonly title: string;
  readonly description?: string;
  readonly type: QuestionnaireType;
  readonly is_active: boolean;
  readonly created_by?: UserOutput;
  readonly created_by_id: string;
}
