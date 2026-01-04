import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsTimeZone,
  Max,
  Min,
} from 'class-validator';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class UpdateTherapistSettings {
  @IsOptional()
  @IsString()
  @IsTimeZone()
  readonly timezone?: string;

  @IsOptional()
  @IsBooleanish()
  readonly is_open?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly booking_threshold_hours?: number;

  @IsOptional()
  @IsNumber()
  @Min(7)
  readonly max_booking_days?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8)
  readonly max_sessions_per_day?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(120)
  readonly session_duration_minutes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(60)
  readonly buffer_minutes?: number;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
