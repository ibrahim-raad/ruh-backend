import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCountry {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
