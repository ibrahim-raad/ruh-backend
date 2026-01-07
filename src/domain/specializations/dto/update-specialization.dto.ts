import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSpecialization {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
