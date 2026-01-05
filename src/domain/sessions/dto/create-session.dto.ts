import { Type } from 'class-transformer';
import {
  IsDate,
  IsISO8601,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateSession {
  @IsNotEmpty()
  @IsUUID()
  readonly therapy_case_id: string;

  /**
   * Preferred: an ISO datetime with offset, e.g. 2026-01-06T09:00:00+02:00.
   */
  @IsNotEmpty()
  @IsString()
  @IsISO8601({ strict: true })
  readonly start: string;
}
