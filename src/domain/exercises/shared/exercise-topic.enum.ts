import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum ExerciseTopic {
  CREATED = 'exercise.created',
  UPDATED = 'exercise.updated',
  REMOVED = 'exercise.removed',
}

export const ExerciseAuditTopic: Record<AuditEvent, ExerciseTopic> = {
  [AuditEvent.CREATED]: ExerciseTopic.CREATED,
  [AuditEvent.UPDATED]: ExerciseTopic.UPDATED,
  [AuditEvent.REMOVED]: ExerciseTopic.REMOVED,
};
