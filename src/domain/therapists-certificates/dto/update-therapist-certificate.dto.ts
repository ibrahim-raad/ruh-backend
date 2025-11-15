import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateTherapistCertificate {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly issuer?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly issued_date?: Date;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsUUID()
  readonly specialization_id?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
