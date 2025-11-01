import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum SpecializationTopic {
  CREATED = 'specialization.created',
  UPDATED = 'specialization.updated',
  REMOVED = 'specialization.removed',
}

export const SpecializationAuditTopic: Record<AuditEvent, SpecializationTopic> =
  {
    [AuditEvent.CREATED]: SpecializationTopic.CREATED,
    [AuditEvent.UPDATED]: SpecializationTopic.UPDATED,
    [AuditEvent.REMOVED]: SpecializationTopic.REMOVED,
  };
