import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCurrency {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsOptional()
  @IsString()
  readonly symbol?: string;
}
