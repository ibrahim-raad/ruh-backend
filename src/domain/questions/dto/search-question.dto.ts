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
import { QuestionType } from '../shared/question-type.enum';
import { IsArrayOrSingle } from 'src/domain/shared/decorators/is-array-or-single.decorator';

export class SearchQuestion implements Pageable {
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
  readonly sort: string = 'question ASC, order ASC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly question?: string;

  @IsOptional()
  @IsArrayOrSingle()
  @IsEnum(QuestionType, { each: true })
  readonly types?: QuestionType[];

  @IsOptional()
  @IsUUID()
  readonly questionnaire_id?: string;
}
