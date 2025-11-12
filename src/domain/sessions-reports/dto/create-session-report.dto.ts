import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class CreateSessionReport {
  @IsOptional()
  @IsString()
  readonly overview?: string;

  @IsNotEmpty()
  @IsString()
  readonly diagnosis: string;

  @IsNotEmpty()
  @IsString()
  readonly recommendations: string;

  @IsNotEmpty()
  @IsString()
  readonly next_steps: string;

  @IsNotEmpty()
  @IsNumber()
  readonly progress_score: number;

  @IsOptional()
  @IsBooleanish()
  readonly ai_assisted?: boolean;

  @IsOptional()
  @IsBooleanish()
  readonly is_finalized?: boolean;

  @IsNotEmpty()
  @IsUUID()
  readonly session_id: string;
}
