import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { ReflectionMood } from '../shared/reflection-mood.enum';

export class CreateReflection {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsBooleanish()
  readonly is_private: boolean = false;

  @IsOptional()
  @IsEnum(ReflectionMood)
  readonly mood: ReflectionMood = ReflectionMood.OKAY;
}
