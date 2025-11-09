import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum ReflectionTopic {
  CREATED = 'reflection.created',
  UPDATED = 'reflection.updated',
  REMOVED = 'reflection.removed',
}

export const ReflectionAuditTopic: Record<AuditEvent, ReflectionTopic> = {
  [AuditEvent.CREATED]: ReflectionTopic.CREATED,
  [AuditEvent.UPDATED]: ReflectionTopic.UPDATED,
  [AuditEvent.REMOVED]: ReflectionTopic.REMOVED,
};
