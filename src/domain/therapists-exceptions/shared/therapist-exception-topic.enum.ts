import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum TherapistExceptionTopic {
  CREATED = 'therapist-exception.created',
  UPDATED = 'therapist-exception.updated',
  REMOVED = 'therapist-exception.removed',
}

export const TherapistExceptionAuditTopic: Record<
  AuditEvent,
  TherapistExceptionTopic
> = {
  [AuditEvent.CREATED]: TherapistExceptionTopic.CREATED,
  [AuditEvent.UPDATED]: TherapistExceptionTopic.UPDATED,
  [AuditEvent.REMOVED]: TherapistExceptionTopic.REMOVED,
};
