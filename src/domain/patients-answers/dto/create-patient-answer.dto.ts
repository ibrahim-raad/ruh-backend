import {
  isDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsOptionalInCase } from 'src/domain/shared/decorators/is-optional-in-case.decorator';

export class CreatePatientAnswer {
  @IsNotEmpty()
  @IsUUID()
  readonly question_id: string;

  @IsOptionalInCase('$answer')
  @IsUUID()
  readonly possible_answer_id?: string;

  @IsOptionalInCase('$possible_answer_id')
  @IsString()
  readonly answer?: string;
}
