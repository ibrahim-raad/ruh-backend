import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Patient } from './patient.entity';

@Entity({ name: 'patients_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class PatientAudit extends AuditEntity<Patient> {}
