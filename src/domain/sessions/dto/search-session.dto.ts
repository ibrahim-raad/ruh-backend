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
import { SessionType } from '../shared/session-type.enum';
import { SessionStatus } from '../shared/session-status.enum';

export class SearchSession implements Pageable {
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
  readonly sort: string = 'start_time DESC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly therapy_case_id?: string;

  @IsOptional()
  @IsEnum(SessionType)
  readonly type?: SessionType;

  @IsOptional()
  @IsEnum(SessionStatus, { each: true })
  readonly statuses?: SessionStatus[];
}
