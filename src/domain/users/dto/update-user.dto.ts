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

export class UpdateUser {
  @IsOptional()
  @IsString()
  readonly full_name?: string;

  @IsOptional()
  @IsEnum(UserGender)
  readonly gender?: UserGender;

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
