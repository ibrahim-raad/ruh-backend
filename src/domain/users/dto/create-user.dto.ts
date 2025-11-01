import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { UserRole } from '../shared/user-role.enum';
import { UserGender } from '../shared/user-gender.enum';
import { Type } from 'class-transformer';

export class CreateUser {
  @IsNotEmpty()
  @IsString()
  readonly full_name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol',
    },
  )
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;

  @IsNotEmpty()
  @IsEnum(UserGender)
  readonly gender: UserGender;

  @IsNotEmpty()
  @IsUUID()
  readonly country_id?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly date_of_birth: Date;
}
