import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateExercise } from './dto/create-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import { UpdateExercise } from './dto/update-exercise.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { ExerciseOutput } from './dto/exercise.output';
import { UserMapper } from '../users/user.mapper';

@Injectable()
export class ExerciseMapper {
  constructor(private readonly userMapper: UserMapper) {}
  public toModel(input: CreateExercise): Exercise;

  public toModel(input: UpdateExercise, existing: Exercise): Exercise;

  public toModel(
    input: CreateExercise | UpdateExercise,
    existing?: Exercise,
  ): Exercise {
    let data = {};

    if (input instanceof UpdateExercise) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        title: input.title ?? existing?.title,
        description: input.description ?? existing?.description,
        visibility: input.visibility ?? existing?.visibility,
        category: input.category ?? existing?.category,
        config: input.config ?? existing?.config,
        created_by: existing?.created_by,
      };
    } else {
      data = {
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        category: input.category,
        config: input.config,
      };
    }
    return Object.assign(new Exercise(), existing ?? {}, data);
  }

  public toOutput(input: Exercise): ExerciseOutput {
    return Object.assign(new ExerciseOutput(), {
      id: input.id,
      title: input.title,
      description: input.description,
      visibility: input.visibility,
      category: input.category,
      config: input.config,
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
