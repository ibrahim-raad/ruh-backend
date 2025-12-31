import { Injectable } from '@nestjs/common';
import { QuestionnaireService } from '../questionnaires/questionnaire.service';
import { QuestionService } from '../questions/question.service';
import { PossibleAnswerService } from '../possible-answers/possible-answer.service';
import { QuestionnaireType } from '../questionnaires/shared/questionnaire-type.enum';
import {
  FullQuestionnaireOutput,
  FullQuestionsOutput,
} from './dto/full-questionnaire.output';
import { SearchQuestion } from '../questions/dto/search-question.dto';
import { SearchPossibleAnswer } from '../possible-answers/dto/search-possible-answer.dto';
import {
  FullQuestionnaire,
  FullQuestions,
} from './dto/full-questionnaire.interface';

@Injectable()
export class FullQuestionnaireService {
  constructor(
    private readonly questionnaireService: QuestionnaireService,
    private readonly questionService: QuestionService,
    private readonly possibleAnswerService: PossibleAnswerService,
  ) {}

  public async getFullQuestionnaire(
    questionnaireType: QuestionnaireType,
  ): Promise<FullQuestionnaire> {
    const questionnaire = await this.questionnaireService.one({
      type: questionnaireType,
      is_active: true,
    });
    const criteria = new SearchQuestion();
    criteria.questionnaire_id = questionnaire.id;
    const questions = await this.questionService.find(criteria);
    const fullQuestions: FullQuestions[] = await Promise.all(
      questions.items.map(async (question) => {
        const criteria = new SearchPossibleAnswer();
        criteria.question_id = question.id;
        const possibleAnswers = await this.possibleAnswerService.find(criteria);
        return {
          question,
          possible_answers: possibleAnswers.items,
        };
      }),
    );
    return {
      questionnaire,
      questions: fullQuestions,
    };
  }
}
