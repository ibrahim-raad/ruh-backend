import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum TherapistTopic {
  CREATED = 'therapist.created',
  UPDATED = 'therapist.updated',
  REMOVED = 'therapist.removed',
}

export const TherapistAuditTopic: Record<AuditEvent, TherapistTopic> = {
  [AuditEvent.CREATED]: TherapistTopic.CREATED,
  [AuditEvent.UPDATED]: TherapistTopic.UPDATED,
  [AuditEvent.REMOVED]: TherapistTopic.REMOVED,
};
