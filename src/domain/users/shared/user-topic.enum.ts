import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum UserTopic {
  CREATED = 'user.created',
  UPDATED = 'user.updated',
  REMOVED = 'user.removed',
}

export const UserAuditTopic: Record<AuditEvent, UserTopic> = {
  [AuditEvent.CREATED]: UserTopic.CREATED,
  [AuditEvent.UPDATED]: UserTopic.UPDATED,
  [AuditEvent.REMOVED]: UserTopic.REMOVED,
};
