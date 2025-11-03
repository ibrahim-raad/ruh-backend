import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { QuestionType } from '../shared/question-type.enum';

export class UpdateQuestion {
  @IsOptional()
  @IsString()
  readonly question?: string;

  @IsOptional()
  @IsNumber()
  readonly order?: number;

  @IsOptional()
  @IsEnum(QuestionType)
  readonly type?: QuestionType;

  @IsOptional()
  @IsUUID()
  readonly questionnaire_id?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
