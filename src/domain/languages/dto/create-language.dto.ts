import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLanguage {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly code: string;
}
