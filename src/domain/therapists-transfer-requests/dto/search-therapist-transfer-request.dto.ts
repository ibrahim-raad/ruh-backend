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
import { TherapistTransferRequestStatus } from '../shared/therapist-transfer-request-status.enum';

export class SearchTherapistTransferRequest implements Pageable {
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
  @IsString()
  readonly transfer_reason?: string;

  @IsOptional()
  @IsEnum(TherapistTransferRequestStatus, { each: true })
  readonly statuses?: TherapistTransferRequestStatus[];

  @IsOptional()
  @IsUUID()
  readonly therapist_id?: string;

  @IsOptional()
  @IsUUID()
  readonly patient_id?: string;

  @IsOptional()
  @IsUUID()
  readonly from_therapy_case_id?: string;

  @IsOptional()
  @IsUUID()
  readonly to_therapy_case_id?: string;
}
