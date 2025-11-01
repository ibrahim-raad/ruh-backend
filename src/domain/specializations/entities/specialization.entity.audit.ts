import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Specialization } from './specialization.entity';

@Entity({ name: 'specializations_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class SpecializationAudit extends AuditEntity<Specialization> {}
