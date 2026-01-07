import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateQuestionnaire } from './dto/create-questionnaire.dto';
import { Questionnaire } from './entities/questionnaire.entity';
import { UpdateQuestionnaire } from './dto/update-questionnaire.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { QuestionnaireOutput } from './dto/questionnaire.output';
import { UserMapper } from '../users/user.mapper';

@Injectable()
export class QuestionnaireMapper {
  constructor(private readonly userMapper: UserMapper) {}
  public toModel(input: CreateQuestionnaire): Questionnaire;

  public toModel(
    input: UpdateQuestionnaire,
    existing: Questionnaire,
  ): Questionnaire;

  public toModel(
    input: CreateQuestionnaire | UpdateQuestionnaire,
    existing?: Questionnaire,
  ): Questionnaire {
    let data = {};

    if (input instanceof UpdateQuestionnaire) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        title: input.title ?? existing?.title,
        description: input.description ?? existing?.description,
        type: input.type ?? existing?.type,
        is_active: input.is_active ?? existing?.is_active,
      };
    } else {
      data = {
        title: input.title,
        description: input.description,
        type: input.type,
        is_active: input.is_active,
      };
    }
    return Object.assign(new Questionnaire(), existing ?? {}, data);
  }

  public toOutput(input: Questionnaire): QuestionnaireOutput {
    return Object.assign(new QuestionnaireOutput(), {
      id: input.id,
      title: input.title,
      description: input.description,
      type: input.type,
      is_active: input.is_active,
      created_by: input.created_by
        ? this.userMapper.toOutput(input.created_by)
        : undefined,
      created_by_id: input.created_by_id,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
