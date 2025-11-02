import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Admin } from './admin.entity';

@Entity({ name: 'admins_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class AdminAudit extends AuditEntity<Admin> {}
