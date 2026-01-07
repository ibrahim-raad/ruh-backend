import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReflectionMood } from '../shared/reflection-mood.enum';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class UpdateReflection {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsBooleanish()
  readonly is_private?: boolean;

  @IsOptional()
  @IsEnum(ReflectionMood)
  readonly mood?: ReflectionMood;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
