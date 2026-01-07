import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLanguage {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly code?: string;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
