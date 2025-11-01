import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpecialization {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
