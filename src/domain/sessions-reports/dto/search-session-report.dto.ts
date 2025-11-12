import {
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

export class SearchSessionReport implements Pageable {
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
  readonly sort: string = 'created_at DESC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly overview?: string;

  @IsOptional()
  @IsString()
  readonly diagnosis?: string;

  @IsOptional()
  @IsString()
  readonly recommendations?: string;

  @IsOptional()
  @IsString()
  readonly next_steps?: string;

  @IsOptional()
  @IsBooleanish()
  readonly ai_assisted?: boolean;

  @IsOptional()
  @IsBooleanish()
  readonly is_finalized?: boolean;

  @IsOptional()
  @IsUUID()
  readonly session_id?: string;
}
