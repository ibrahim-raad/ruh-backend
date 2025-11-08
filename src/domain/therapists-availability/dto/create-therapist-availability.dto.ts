import { IsEnum, IsMilitaryTime, IsNotEmpty, IsString } from 'class-validator';
import { DayOfWeek } from '../shared/day-of-week.enum';

export class CreateTherapistAvailability {
  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  readonly day_of_week: DayOfWeek;

  @IsNotEmpty()
  @IsString()
  @IsMilitaryTime()
  readonly start_time: string;

  @IsNotEmpty()
  @IsString()
  @IsMilitaryTime()
  readonly end_time: string;
}
