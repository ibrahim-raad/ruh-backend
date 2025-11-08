import {
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DayOfWeek } from '../shared/day-of-week.enum';

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

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
