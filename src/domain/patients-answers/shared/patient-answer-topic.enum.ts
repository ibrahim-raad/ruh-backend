import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum PatientAnswerTopic {
  CREATED = 'patient-answer.created',
  UPDATED = 'patient-answer.updated',
  REMOVED = 'patient-answer.removed',
}

export const PatientAnswerAuditTopic: Record<AuditEvent, PatientAnswerTopic> = {
  [AuditEvent.CREATED]: PatientAnswerTopic.CREATED,
  [AuditEvent.UPDATED]: PatientAnswerTopic.UPDATED,
  [AuditEvent.REMOVED]: PatientAnswerTopic.REMOVED,
};
