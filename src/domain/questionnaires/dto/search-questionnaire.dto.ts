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
import { QuestionnaireType } from '../shared/questionnaire-type.enum';
import { IsArrayOrSingle } from 'src/domain/shared/decorators/is-array-or-single.decorator';

export class SearchQuestionnaire implements Pageable {
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
  @IsArrayOrSingle()
  @IsEnum(QuestionnaireType, { each: true })
  readonly types?: QuestionnaireType[];

  @IsOptional()
  @IsBooleanish()
  readonly is_active?: boolean;

  @IsOptional()
  @IsBooleanish()
  readonly with_created_by?: boolean = false;
}
