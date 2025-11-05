import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { PatientAnswer } from './patient-answer.entity';

@Entity({ name: 'patients_answers_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class PatientAnswerAudit extends AuditEntity<PatientAnswer> {}
