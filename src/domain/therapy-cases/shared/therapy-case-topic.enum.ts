import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum TherapyCaseTopic {
  CREATED = 'therapy-case.created',
  UPDATED = 'therapy-case.updated',
  REMOVED = 'therapy-case.removed',
}

export const TherapyCaseAuditTopic: Record<AuditEvent, TherapyCaseTopic> = {
  [AuditEvent.CREATED]: TherapyCaseTopic.CREATED,
  [AuditEvent.UPDATED]: TherapyCaseTopic.UPDATED,
  [AuditEvent.REMOVED]: TherapyCaseTopic.REMOVED,
};
