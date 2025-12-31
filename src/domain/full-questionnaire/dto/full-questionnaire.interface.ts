import { PossibleAnswer } from 'src/domain/possible-answers/entities/possible-answer.entity';
import { Questionnaire } from 'src/domain/questionnaires/entities/questionnaire.entity';
import { Question } from 'src/domain/questions/entities/question.entity';

export interface FullQuestionnaire {
  questionnaire: Questionnaire;
  questions: FullQuestions[];
}

export interface FullQuestions {
  question: Question;
  possible_answers: PossibleAnswer[];
}
