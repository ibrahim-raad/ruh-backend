import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Pageable } from 'src/domain/shared/pageable.interface';
import { DEFAULT_PAGE_SIZE } from 'src/app.constants';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { AssignedExerciseStatus } from '../shared/assigned-exercise-status.enum';

export class SearchAssignedExercise implements Pageable {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly offset: number = 0;

  @IsOptional()
  @IsNumber()
  @Max(DEFAULT_PAGE_SIZE)
  readonly limit: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  readonly sort: string = 'created_at ASC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly completion_notes?: string;

  @IsOptional()
  @IsEnum(AssignedExerciseStatus, { each: true })
  readonly statuses?: AssignedExerciseStatus[];

  @IsOptional()
  @IsString()
  readonly exercise_id?: string;
}
