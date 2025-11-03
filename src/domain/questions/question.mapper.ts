import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateQuestion } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { UpdateQuestion } from './dto/update-question.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { QuestionOutput } from './dto/question.output';
import { QuestionnaireMapper } from '../questionnaires/questionnaire.mapper';

@Injectable()
export class QuestionMapper {
  constructor(private readonly questionnaireMapper: QuestionnaireMapper) {}
  public toModel(input: CreateQuestion): Question;

  public toModel(input: UpdateQuestion, existing: Question): Question;

  public toModel(
    input: CreateQuestion | UpdateQuestion,
    existing?: Question,
  ): Question {
    let data = {};

    if (input instanceof UpdateQuestion) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        question: input.question ?? existing?.question,
        order: input.order ?? existing?.order,
        type: input.type ?? existing?.type,
        questionnaire: input.questionnaire_id
          ? { id: input.questionnaire_id }
          : existing?.questionnaire,
      };
    } else {
      data = {
        question: input.question,
        order: 0,
        type: input.type,
        questionnaire: input.questionnaire_id
          ? { id: input.questionnaire_id }
          : undefined,
      };
    }
    return Object.assign(new Question(), existing ?? {}, data);
  }

  public toOutput(input: Question): QuestionOutput {
    return Object.assign(new QuestionOutput(), {
      id: input.id,
      question: input.question,
      order: parseFloat(input.order.toString()),
      type: input.type,
      questionnaire: input.questionnaire
        ? this.questionnaireMapper.toOutput(input.questionnaire)
        : undefined,
      questionnaire_id: input.questionnaireId,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
