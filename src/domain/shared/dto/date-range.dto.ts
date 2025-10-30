import { Range, StrictRange } from '../range.interface';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { IsAfter } from '../decorators';

export class DateRangeInput implements Range<Date> {
  @IsOptional()
  @IsDate()
  readonly from?: Date;

  @IsOptional()
  @IsDate()
  @IsAfter('$from')
  readonly to?: Date;
}

export class DateStrictRangeInput implements StrictRange<Date> {
  @IsNotEmpty()
  @IsDate()
  readonly from: Date;

  @IsNotEmpty()
  @IsDate()
  @IsAfter('$from')
  readonly to: Date;
}
