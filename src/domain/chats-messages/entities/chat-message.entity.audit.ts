import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { ChatMessage } from './chat-message.entity';

@Entity({ name: 'chats_messages_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class ChatMessageAudit extends AuditEntity<ChatMessage> {}
