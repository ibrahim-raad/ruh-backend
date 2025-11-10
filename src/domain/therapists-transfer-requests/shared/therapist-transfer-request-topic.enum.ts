import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum TherapistTransferRequestTopic {
  CREATED = 'therapist-transfer-request.created',
  UPDATED = 'therapist-transfer-request.updated',
  REMOVED = 'therapist-transfer-request.removed',
}

export const TherapistTransferRequestAuditTopic: Record<
  AuditEvent,
  TherapistTransferRequestTopic
> = {
  [AuditEvent.CREATED]: TherapistTransferRequestTopic.CREATED,
  [AuditEvent.UPDATED]: TherapistTransferRequestTopic.UPDATED,
  [AuditEvent.REMOVED]: TherapistTransferRequestTopic.REMOVED,
};
