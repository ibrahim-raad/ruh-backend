import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../users/shared/user-role.enum';
import { Transform, TransformFnParams } from 'class-transformer';

export class SignupUser {
  @IsNotEmpty()
  @IsString()
  readonly full_name: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: TransformFnParams): string =>
    (value as string)?.toLowerCase(),
  )
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;
}
