import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExerciseVisibility } from '../shared/exercise-visibility.enum';
import { ExerciseCategory } from '../shared/exercise-category.enum';

export class CreateExercise {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsEnum(ExerciseVisibility)
  readonly visibility: ExerciseVisibility;

  @IsNotEmpty()
  @IsEnum(ExerciseCategory)
  readonly category: ExerciseCategory;

  @IsOptional()
  @IsJSON()
  readonly config?: Record<string, any>;
}
