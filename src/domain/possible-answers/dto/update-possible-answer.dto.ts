import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdatePossibleAnswer {
  @IsOptional()
  @IsString()
  readonly answer?: string;

  @IsOptional()
  @IsNumber()
  readonly order?: number;

  @IsOptional()
  @IsUUID()
  readonly question_id?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
