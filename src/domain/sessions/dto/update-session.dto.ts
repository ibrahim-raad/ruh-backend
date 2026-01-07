import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSession {
  @IsOptional()
  @IsString()
  readonly patient_feedback?: string;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
