import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTherapistTransferRequest {
  @IsNotEmpty()
  @IsString()
  readonly transfer_reason: string;

  @IsNotEmpty()
  @IsUUID()
  readonly therapist_id: string;

  @IsOptional()
  @IsUUID()
  readonly from_therapy_case_id?: string;
}
