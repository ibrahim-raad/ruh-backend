import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExerciseVisibility } from '../shared/exercise-visibility.enum';
import { ExerciseCategory } from '../shared/exercise-category.enum';

export class UpdateExercise {
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
  @IsJSON()
  readonly config?: Record<string, any>;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
