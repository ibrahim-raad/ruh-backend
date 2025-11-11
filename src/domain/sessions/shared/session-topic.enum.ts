import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum SessionTopic {
  CREATED = 'session.created',
  UPDATED = 'session.updated',
  REMOVED = 'session.removed',
}

export const SessionAuditTopic: Record<AuditEvent, SessionTopic> = {
  [AuditEvent.CREATED]: SessionTopic.CREATED,
  [AuditEvent.UPDATED]: SessionTopic.UPDATED,
  [AuditEvent.REMOVED]: SessionTopic.REMOVED,
};
