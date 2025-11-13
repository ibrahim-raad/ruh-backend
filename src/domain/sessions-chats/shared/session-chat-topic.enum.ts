import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum SessionChatTopic {
  CREATED = 'session-chat.created',
  UPDATED = 'session-chat.updated',
  REMOVED = 'session-chat.removed',
}

export const SessionChatAuditTopic: Record<AuditEvent, SessionChatTopic> = {
  [AuditEvent.CREATED]: SessionChatTopic.CREATED,
  [AuditEvent.UPDATED]: SessionChatTopic.UPDATED,
  [AuditEvent.REMOVED]: SessionChatTopic.REMOVED,
};
