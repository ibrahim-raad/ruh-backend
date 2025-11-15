import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum AssignedExerciseTopic {
  CREATED = 'assigned-exercise.created',
  UPDATED = 'assigned-exercise.updated',
  REMOVED = 'assigned-exercise.removed',
}

export const AssignedExerciseAuditTopic: Record<
  AuditEvent,
  AssignedExerciseTopic
> = {
  [AuditEvent.CREATED]: AssignedExerciseTopic.CREATED,
  [AuditEvent.UPDATED]: AssignedExerciseTopic.UPDATED,
  [AuditEvent.REMOVED]: AssignedExerciseTopic.REMOVED,
};
