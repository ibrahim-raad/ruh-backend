import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { UpdateUser } from 'src/domain/users/dto/update-user.dto';

export class UpdateTherapist extends UpdateUser {
  @IsOptional()
  @IsString()
  readonly bio?: string;

  @IsOptional()
  @IsNumber()
  readonly years_of_experience?: number;

  @IsOptional()
  @IsNumber()
  readonly rate_per_hour?: number;

  @IsOptional()
  @IsString()
  readonly currency_id?: string;

  @IsOptional()
  @IsBooleanish()
  readonly is_psychiatrist?: boolean;

  @IsOptional()
  @IsString()
  readonly license_number?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly license_expiration_date?: Date;

  @IsOptional()
  @IsString()
  readonly payment_provider_account_id?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly therapist_version: number;
}
