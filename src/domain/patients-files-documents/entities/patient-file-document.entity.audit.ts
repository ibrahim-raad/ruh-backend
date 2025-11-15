import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { PatientFileDocument } from './patient-file-document.entity';

@Entity({ name: 'patients_files_documents_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class PatientFileDocumentAudit extends AuditEntity<PatientFileDocument> {}
