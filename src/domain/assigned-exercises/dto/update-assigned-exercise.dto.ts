import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AssignedExerciseStatus } from '../shared/assigned-exercise-status.enum';

export class UpdateAssignedExercise {
  @IsOptional()
  @IsString()
  readonly completion_notes?: string;

  @IsOptional()
  @IsEnum(AssignedExerciseStatus)
  readonly status?: AssignedExerciseStatus;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
