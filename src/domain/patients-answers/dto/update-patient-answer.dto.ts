import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdatePatientAnswer {
  @IsOptional()
  @IsString()
  readonly answer?: string;

  @IsOptional()
  @IsUUID()
  readonly possible_answer_id?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
