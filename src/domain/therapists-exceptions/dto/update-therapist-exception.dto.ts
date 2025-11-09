import { Type } from 'class-transformer';
import {
  IsDate,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class UpdateTherapistException {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly date?: Date;

  @IsOptional()
  @IsBooleanish()
  readonly is_available?: boolean;

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  readonly start_time?: string;

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  readonly end_time?: string;

  @IsOptional()
  @IsString()
  readonly reason?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
