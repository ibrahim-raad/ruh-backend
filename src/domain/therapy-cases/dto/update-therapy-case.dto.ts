import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTherapyCase {
  @IsOptional()
  @IsString()
  readonly notes?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
