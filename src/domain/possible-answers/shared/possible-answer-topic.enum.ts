import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum PossibleAnswerTopic {
  CREATED = 'possible-answer.created',
  UPDATED = 'possible-answer.updated',
  REMOVED = 'possible-answer.removed',
}

export const PossibleAnswerAuditTopic: Record<AuditEvent, PossibleAnswerTopic> =
  {
    [AuditEvent.CREATED]: PossibleAnswerTopic.CREATED,
    [AuditEvent.UPDATED]: PossibleAnswerTopic.UPDATED,
    [AuditEvent.REMOVED]: PossibleAnswerTopic.REMOVED,
  };
