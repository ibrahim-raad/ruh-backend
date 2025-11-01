import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { User } from './user.entity';

@Entity({ name: 'users_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class UserAudit extends AuditEntity<User> {}
