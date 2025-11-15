import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum TherapistCertificateTopic {
  CREATED = 'therapist-certificate.created',
  UPDATED = 'therapist-certificate.updated',
  REMOVED = 'therapist-certificate.removed',
}

export const TherapistCertificateAuditTopic: Record<
  AuditEvent,
  TherapistCertificateTopic
> = {
  [AuditEvent.CREATED]: TherapistCertificateTopic.CREATED,
  [AuditEvent.UPDATED]: TherapistCertificateTopic.UPDATED,
  [AuditEvent.REMOVED]: TherapistCertificateTopic.REMOVED,
};
