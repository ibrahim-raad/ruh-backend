import { PossibleAnswerOutput } from 'src/domain/possible-answers/dto/possible-answer.output';
import { QuestionnaireOutput } from 'src/domain/questionnaires/dto/questionnaire.output';
import { QuestionOutput } from 'src/domain/questions/dto/question.output';

export class FullQuestionnaireOutput {
  readonly questionnaire: QuestionnaireOutput;
  readonly questions: FullQuestionsOutput[];
}

export class FullQuestionsOutput {
  readonly question: QuestionOutput;
  readonly possible_answers: PossibleAnswerOutput[];
}
