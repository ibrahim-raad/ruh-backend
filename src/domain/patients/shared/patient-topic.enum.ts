import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum PatientTopic {
  CREATED = 'patient.created',
  UPDATED = 'patient.updated',
  REMOVED = 'patient.removed',
}

export const PatientAuditTopic: Record<AuditEvent, PatientTopic> = {
  [AuditEvent.CREATED]: PatientTopic.CREATED,
  [AuditEvent.UPDATED]: PatientTopic.UPDATED,
  [AuditEvent.REMOVED]: PatientTopic.REMOVED,
};
