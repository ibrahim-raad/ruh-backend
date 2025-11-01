import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenInput {
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
