import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendConfig {
  @IsNotEmpty()
  @IsString()
  readonly apiKey: string;

  @IsNotEmpty()
  @IsEmail()
  readonly fromEmail: string;
}
