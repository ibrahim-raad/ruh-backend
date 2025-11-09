import { Type } from 'class-transformer';
import {
  IsDate,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class CreateTherapistException {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly date: Date;

  @IsOptional()
  @IsBooleanish()
  readonly is_available: boolean = true;

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  readonly start_time: string = '09:00'; // HH:MM format

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  readonly end_time: string = '17:00'; // HH:MM format

  @IsOptional()
  @IsString()
  readonly reason?: string;
}
