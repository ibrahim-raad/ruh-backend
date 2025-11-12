import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class UpdateSessionReport {
  @IsOptional()
  @IsString()
  readonly overview?: string;

  @IsOptional()
  @IsString()
  readonly diagnosis?: string;

  @IsOptional()
  @IsString()
  readonly recommendations?: string;

  @IsOptional()
  @IsString()
  readonly next_steps?: string;

  @IsOptional()
  @IsNumber()
  readonly progress_score?: number;

  @IsOptional()
  @IsBooleanish()
  readonly ai_assisted?: boolean;

  @IsOptional()
  @IsBooleanish()
  readonly is_finalized?: boolean;

  @IsOptional()
  @IsNumber()
  readonly version: number;
}
