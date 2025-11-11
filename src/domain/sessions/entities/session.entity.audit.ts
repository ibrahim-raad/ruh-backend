import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Session } from './session.entity';

@Entity({ name: 'sessions_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class SessionAudit extends AuditEntity<Session> {}
