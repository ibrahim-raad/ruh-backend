import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePossibleAnswer {
  @IsNotEmpty()
  @IsString()
  readonly answer: string;
  @IsNotEmpty()
  @IsUUID()
  readonly question_id: string;
}
