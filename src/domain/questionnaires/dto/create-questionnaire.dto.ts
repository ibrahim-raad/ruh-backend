import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QuestionnaireType } from '../shared/questionnaire-type.enum';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class CreateQuestionnaire {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsEnum(QuestionnaireType)
  readonly type: QuestionnaireType;

  @IsOptional()
  @IsBooleanish()
  readonly is_active: boolean = false;
}
