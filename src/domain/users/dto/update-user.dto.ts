import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserGender } from '../shared/user-gender.enum';
import { Type } from 'class-transformer';
import { UserStatus } from '../shared/user-status.enum';

export class UpdateUser {
  @IsOptional()
  @IsString()
  readonly full_name?: string;

  @IsOptional()
  @IsEnum(UserGender)
  readonly gender?: UserGender;

  @IsOptional()
  @IsEnum(UserStatus)
  readonly status?: UserStatus;

  @IsOptional()
  @IsUUID()
  readonly country_id?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly date_of_birth?: Date;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
