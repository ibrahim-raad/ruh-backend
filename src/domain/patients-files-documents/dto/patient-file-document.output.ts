import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { PatientFileDocumentType } from '../shared/patient-file-document-type.enum';
import { TherapyCaseOutput } from 'src/domain/therapy-cases/dto/therapy-case.output';

export class PatientFileDocumentOutput extends AuditableOutput {
  readonly file_url: string;
  readonly description?: string;
  readonly type: PatientFileDocumentType;
  readonly is_uploaded_by_patient: boolean;
  readonly therapy_case_id?: string;
  readonly therapy_case: TherapyCaseOutput;
}
