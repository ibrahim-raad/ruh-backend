import { Type } from 'class-transformer';
import {
  IsDate,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSession {
  @IsNotEmpty()
  @IsUUID()
  readonly therapy_case_id: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly date: Date;

  @IsNotEmpty()
  @IsString()
  @IsMilitaryTime()
  readonly start_time: string;
}
