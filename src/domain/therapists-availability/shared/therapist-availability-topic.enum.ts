import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum TherapistAvailabilityTopic {
  CREATED = 'therapist-availability.created',
  UPDATED = 'therapist-availability.updated',
  REMOVED = 'therapist-availability.removed',
}

export const TherapistAvailabilityAuditTopic: Record<
  AuditEvent,
  TherapistAvailabilityTopic
> = {
  [AuditEvent.CREATED]: TherapistAvailabilityTopic.CREATED,
  [AuditEvent.UPDATED]: TherapistAvailabilityTopic.UPDATED,
  [AuditEvent.REMOVED]: TherapistAvailabilityTopic.REMOVED,
};
