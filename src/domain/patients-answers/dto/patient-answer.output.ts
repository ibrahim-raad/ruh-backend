import { PatientOutput } from 'src/domain/patients/dto/patient.output';
import { PossibleAnswerOutput } from 'src/domain/possible-answers/dto/possible-answer.output';
import { QuestionOutput } from 'src/domain/questions/dto/question.output';
import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class PatientAnswerOutput extends AuditableOutput {
  readonly question_id?: string;
  readonly possible_answer_id?: string;
  readonly answer?: string;
  readonly question: QuestionOutput;
  readonly possible_answer?: PossibleAnswerOutput;
  readonly patient: PatientOutput;
  readonly patient_id?: string;
}
