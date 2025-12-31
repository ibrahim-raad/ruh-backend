import { Injectable } from '@nestjs/common';
import { PossibleAnswerMapper } from '../possible-answers/possible-answer.mapper';
import { QuestionnaireMapper } from '../questionnaires/questionnaire.mapper';
import { QuestionMapper } from '../questions/question.mapper';
import { FullQuestionnaire } from './dto/full-questionnaire.interface';
import { FullQuestionnaireOutput } from './dto/full-questionnaire.output';

@Injectable()
export class FullQuestionnaireMapper {
  constructor(
    private readonly questionnaireMapper: QuestionnaireMapper,
    private readonly questionMapper: QuestionMapper,
    private readonly possibleAnswerMapper: PossibleAnswerMapper,
  ) {}

  public toOutput(input: FullQuestionnaire): FullQuestionnaireOutput {
    return Object.assign(new FullQuestionnaireOutput(), {
      questionnaire: this.questionnaireMapper.toOutput(input.questionnaire),
      questions: input.questions.map((fullQuestion) => {
        return {
          question: this.questionMapper.toOutput(fullQuestion.question),
          possible_answers: fullQuestion.possible_answers.map(
            (possibleAnswer) =>
              this.possibleAnswerMapper.toOutput(possibleAnswer),
          ),
        };
      }),
    });
  }
}
