import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUser {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: TransformFnParams): string =>
    (value as string)?.toLowerCase(),
  )
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
