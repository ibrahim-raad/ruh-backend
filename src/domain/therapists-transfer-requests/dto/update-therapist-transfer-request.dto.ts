import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TherapistTransferRequestStatusUpdate } from '../shared/therapist-transfer-request-status.enum';

export class UpdateTherapistTransferRequest {
  @IsOptional()
  @IsString()
  readonly status_reason?: string;

  @IsOptional()
  @IsEnum(TherapistTransferRequestStatusUpdate)
  readonly status?: TherapistTransferRequestStatusUpdate;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
