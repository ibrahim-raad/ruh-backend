import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum ChatMessageTopic {
  CREATED = 'chat-message.created',
  UPDATED = 'chat-message.updated',
  REMOVED = 'chat-message.removed',
}

export const ChatMessageAuditTopic: Record<AuditEvent, ChatMessageTopic> = {
  [AuditEvent.CREATED]: ChatMessageTopic.CREATED,
  [AuditEvent.UPDATED]: ChatMessageTopic.UPDATED,
  [AuditEvent.REMOVED]: ChatMessageTopic.REMOVED,
};
