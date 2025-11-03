import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { QuestionType } from '../shared/question-type.enum';
import { QuestionnaireOutput } from 'src/domain/questionnaires/dto/questionnaire.output';

export class QuestionOutput extends AuditableOutput {
  readonly question: string;
  readonly order: number;
  readonly type: QuestionType;
  readonly questionnaire?: QuestionnaireOutput;
  readonly questionnaire_id?: string;
}
