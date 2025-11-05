import { QuestionOutput } from 'src/domain/questions/dto/question.output';
import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class PossibleAnswerOutput extends AuditableOutput {
  readonly answer: string;
  readonly order: number;
  readonly question?: QuestionOutput;
  readonly question_id?: string;
}
