import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DEFAULT_PAGE_SIZE } from '../../../app.constants';
import { AuditEvent } from '../audit-event.enum';
import { Type } from 'class-transformer';
import { DateRangeInput } from './date-range.dto';
import { AuditCriteria } from '../audit.criteria';
import { IsArrayOrSingle } from '../decorators/is-array-or-single.decorator';

export class AuditSearchInput implements AuditCriteria {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly offset: number = 0;

  @IsOptional()
  @IsNumber()
  @Max(100)
  readonly limit: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  readonly sort: string = 'createdAt DESC';

  @IsOptional()
  @IsNumber()
  readonly version?: number;

  @IsOptional()
  @IsArrayOrSingle()
  @IsEnum(AuditEvent, { each: true })
  readonly events?: AuditEvent[];

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeInput)
  readonly date?: DateRangeInput;
}
