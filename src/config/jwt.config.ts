import { IsNotEmpty, IsString } from 'class-validator';

export class JwtConfig {
  @IsNotEmpty()
  @IsString()
  readonly secret: string;

  @IsNotEmpty()
  @IsString()
  readonly expiration: string;
}
