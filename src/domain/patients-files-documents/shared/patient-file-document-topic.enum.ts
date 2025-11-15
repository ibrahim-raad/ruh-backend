import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum PatientFileDocumentTopic {
  CREATED = 'patient-file-document.created',
  UPDATED = 'patient-file-document.updated',
  REMOVED = 'patient-file-document.removed',
}

export const PatientFileDocumentAuditTopic: Record<
  AuditEvent,
  PatientFileDocumentTopic
> = {
  [AuditEvent.CREATED]: PatientFileDocumentTopic.CREATED,
  [AuditEvent.UPDATED]: PatientFileDocumentTopic.UPDATED,
  [AuditEvent.REMOVED]: PatientFileDocumentTopic.REMOVED,
};
