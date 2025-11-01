import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../users/shared/user-role.enum';

export class SignupUser {
  @IsNotEmpty()
  @IsString()
  readonly full_name: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  readonly role: UserRole;
}
