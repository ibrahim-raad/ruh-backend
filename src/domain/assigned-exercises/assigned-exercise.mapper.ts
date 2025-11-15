import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateAssignedExercise } from './dto/create-assigned-exercise.dto';
import { AssignedExercise } from './entities/assigned-exercise.entity';
import { UpdateAssignedExercise } from './dto/update-assigned-exercise.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { AssignedExerciseOutput } from './dto/assigned-exercise.output';
import { ExerciseMapper } from '../exercises/exercise.mapper';
import { TherapyCaseMapper } from '../therapy-cases/therapy-case.mapper';

@Injectable()
export class AssignedExerciseMapper {
  constructor(
    private readonly exerciseMapper: ExerciseMapper,
    private readonly therapyCaseMapper: TherapyCaseMapper,
  ) {}
  public toModel(
    input: CreateAssignedExercise & { therapyCaseId: string },
  ): AssignedExercise;

  public toModel(
    input: UpdateAssignedExercise,
    existing: AssignedExercise,
  ): AssignedExercise;

  public toModel(
    input:
      | (CreateAssignedExercise & { therapyCaseId: string })
      | UpdateAssignedExercise,
    existing?: AssignedExercise,
  ): AssignedExercise {
    let data = {};

    if (input instanceof UpdateAssignedExercise) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        completion_notes: input.completion_notes ?? existing?.completion_notes,
        status: input.status ?? existing?.status,
        exercise: existing?.exercise,
        therapy_case: existing?.therapy_case,
      };
    } else {
      data = {
        exercise: { id: input.exercise_id },
        therapy_case: { id: input.therapyCaseId },
      };
    }
    return Object.assign(new AssignedExercise(), existing ?? {}, data);
  }

  public toOutput(input: AssignedExercise): AssignedExerciseOutput {
    return Object.assign(new AssignedExerciseOutput(), {
      id: input.id,
      completion_notes: input.completion_notes,
      status: input.status,
      exercise: this.exerciseMapper.toOutput(input.exercise),
      exercise_id: input.exerciseId,
      therapy_case: this.therapyCaseMapper.toOutput(input.therapy_case),
      therapy_case_id: input.therapyCaseId,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
