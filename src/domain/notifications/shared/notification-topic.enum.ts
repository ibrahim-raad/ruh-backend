import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum NotificationTopic {
  CREATED = 'notification.created',
  UPDATED = 'notification.updated',
  REMOVED = 'notification.removed',
}

export const NotificationAuditTopic: Record<AuditEvent, NotificationTopic> = {
  [AuditEvent.CREATED]: NotificationTopic.CREATED,
  [AuditEvent.UPDATED]: NotificationTopic.UPDATED,
  [AuditEvent.REMOVED]: NotificationTopic.REMOVED,
};
