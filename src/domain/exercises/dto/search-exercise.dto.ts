import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Pageable } from 'src/domain/shared/pageable.interface';
import { DEFAULT_PAGE_SIZE } from 'src/app.constants';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { ExerciseVisibility } from '../shared/exercise-visibility.enum';
import { ExerciseCategory } from '../shared/exercise-category.enum';

export class SearchExercise implements Pageable {
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
  readonly sort: string = 'title ASC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsEnum(ExerciseVisibility)
  readonly visibility?: ExerciseVisibility;

  @IsOptional()
  @IsEnum(ExerciseCategory)
  readonly category?: ExerciseCategory;

  @IsOptional()
  @IsUUID()
  readonly created_by_id?: string;
}
