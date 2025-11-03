import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { QuestionType } from '../shared/question-type.enum';

export class CreateQuestion {
  @IsNotEmpty()
  @IsString()
  readonly question: string;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  readonly type: QuestionType;

  @IsNotEmpty()
  @IsUUID()
  readonly questionnaire_id: string;
}
