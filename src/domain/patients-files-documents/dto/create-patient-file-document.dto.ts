import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PatientFileDocumentType } from '../shared/patient-file-document-type.enum';

export class CreatePatientFileDocument {
  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsEnum(PatientFileDocumentType)
  readonly type: PatientFileDocumentType;
}
