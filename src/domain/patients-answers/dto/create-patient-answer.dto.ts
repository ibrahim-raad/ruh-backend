import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePatientAnswer {
  @IsNotEmpty()
  @IsUUID()
  readonly question_id: string;

  @IsOptional()
  @IsUUID()
  readonly possible_answer_id?: string;

  @IsOptional()
  @IsString()
  readonly answer?: string;
}
