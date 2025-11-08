import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum TherapistSpecializationTopic {
  CREATED = 'therapist-specialization.created',
  UPDATED = 'therapist-specialization.updated',
  REMOVED = 'therapist-specialization.removed',
}

export const TherapistSpecializationAuditTopic: Record<
  AuditEvent,
  TherapistSpecializationTopic
> = {
  [AuditEvent.CREATED]: TherapistSpecializationTopic.CREATED,
  [AuditEvent.UPDATED]: TherapistSpecializationTopic.UPDATED,
  [AuditEvent.REMOVED]: TherapistSpecializationTopic.REMOVED,
};
