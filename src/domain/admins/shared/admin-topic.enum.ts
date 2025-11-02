import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum AdminTopic {
  CREATED = 'admin.created',
  UPDATED = 'admin.updated',
  REMOVED = 'admin.removed',
}

export const AdminAuditTopic: Record<AuditEvent, AdminTopic> = {
  [AuditEvent.CREATED]: AdminTopic.CREATED,
  [AuditEvent.UPDATED]: AdminTopic.UPDATED,
  [AuditEvent.REMOVED]: AdminTopic.REMOVED,
};
