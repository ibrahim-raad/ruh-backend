import {
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DayOfWeek } from '../shared/day-of-week.enum';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class UpdateTherapistAvailability {
  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  readonly start_time?: string;

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  readonly end_time?: string;

  @IsOptional()
  @IsEnum(DayOfWeek)
  readonly day_of_week?: DayOfWeek;

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  readonly break_start_time?: string;

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  readonly break_end_time?: string;

  @IsOptional()
  @IsBooleanish()
  readonly is_active?: boolean;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
