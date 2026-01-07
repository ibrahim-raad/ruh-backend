import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCurrency {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly code?: string;

  @IsOptional()
  @IsString()
  readonly symbol?: string;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
