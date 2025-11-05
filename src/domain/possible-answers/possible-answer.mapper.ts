import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreatePossibleAnswer } from './dto/create-possible-answer.dto';
import { PossibleAnswer } from './entities/possible-answer.entity';
import { UpdatePossibleAnswer } from './dto/update-possible-answer.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { PossibleAnswerOutput } from './dto/possible-answer.output';
import { QuestionMapper } from '../questions/question.mapper';

@Injectable()
export class PossibleAnswerMapper {
  constructor(private readonly questionMapper: QuestionMapper) {}
  public toModel(input: CreatePossibleAnswer): PossibleAnswer;

  public toModel(
    input: UpdatePossibleAnswer,
    existing: PossibleAnswer,
  ): PossibleAnswer;

  public toModel(
    input: CreatePossibleAnswer | UpdatePossibleAnswer,
    existing?: PossibleAnswer,
  ): PossibleAnswer {
    let data = {};

    if (input instanceof UpdatePossibleAnswer) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        answer: input.answer ?? existing?.answer,
        order: input.order ?? existing?.order,
        question: input.question_id
          ? { id: input.question_id }
          : existing?.question,
      };
    } else {
      data = {
        answer: input.answer,
        order: 0,
        question: input.question_id ? { id: input.question_id } : undefined,
      };
    }
    return Object.assign(new PossibleAnswer(), existing ?? {}, data);
  }

  public toOutput(input: PossibleAnswer): PossibleAnswerOutput {
    return Object.assign(new PossibleAnswerOutput(), {
      id: input.id,
      answer: input.answer,
      order: parseFloat(input.order.toString()),
      question: input.question
        ? this.questionMapper.toOutput(input.question)
        : undefined,
      question_id: input.questionId,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
