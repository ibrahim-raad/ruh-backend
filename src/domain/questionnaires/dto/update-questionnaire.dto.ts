import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QuestionnaireType } from '../shared/questionnaire-type.enum';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class UpdateQuestionnaire {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsEnum(QuestionnaireType)
  readonly type?: QuestionnaireType;

  @IsOptional()
  @IsBooleanish()
  readonly is_active?: boolean;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
