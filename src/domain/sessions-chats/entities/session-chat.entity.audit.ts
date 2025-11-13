import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { SessionChat } from './session-chat.entity';

@Entity({ name: 'sessions_chats_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class SessionChatAudit extends AuditEntity<SessionChat> {}
