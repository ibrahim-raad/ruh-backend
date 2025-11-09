import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Reflection } from './reflection.entity';

@Entity({ name: 'reflections_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class ReflectionAudit extends AuditEntity<Reflection> {}
