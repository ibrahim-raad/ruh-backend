import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Pageable } from 'src/domain/shared/pageable.interface';
import { DEFAULT_PAGE_SIZE } from 'src/app.constants';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { TherapyCaseType } from '../shared/therapy-case-type.enum';
import { TherapyCaseStatus } from '../shared/therapy-case-status.enum';

export class SearchTherapyCase implements Pageable {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly offset: number = 0;

  @IsOptional()
  @IsNumber()
  @Max(DEFAULT_PAGE_SIZE)
  readonly limit: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  readonly sort: string = 'created_at DESC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsUUID()
  readonly patient_id?: string;

  @IsOptional()
  @IsUUID()
  readonly therapist_id?: string;

  @IsOptional()
  @IsUUID()
  readonly transferred_to_id?: string;

  @IsOptional()
  @IsString()
  readonly notes?: string;

  @IsOptional()
  @IsEnum(TherapyCaseType)
  readonly type?: TherapyCaseType;

  @IsOptional()
  @IsEnum(TherapyCaseStatus)
  readonly status?: TherapyCaseStatus;

  @IsOptional()
  @IsString()
  readonly patient_name?: string;
}
