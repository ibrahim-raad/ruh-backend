import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum QuestionTopic {
  CREATED = 'question.created',
  UPDATED = 'question.updated',
  REMOVED = 'question.removed',
}

export const QuestionAuditTopic: Record<AuditEvent, QuestionTopic> = {
  [AuditEvent.CREATED]: QuestionTopic.CREATED,
  [AuditEvent.UPDATED]: QuestionTopic.UPDATED,
  [AuditEvent.REMOVED]: QuestionTopic.REMOVED,
};
