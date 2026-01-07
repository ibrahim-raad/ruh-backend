import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePatientFileDocument {
  @IsOptional()
  @IsString()
  readonly description?: string;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
