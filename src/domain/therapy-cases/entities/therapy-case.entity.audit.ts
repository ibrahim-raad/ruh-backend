import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { TherapyCase } from './therapy-case.entity';

@Entity({ name: 'therapy_cases_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class TherapyCaseAudit extends AuditEntity<TherapyCase> {}
