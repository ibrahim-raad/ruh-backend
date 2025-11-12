import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum SessionAiSummaryTopic {
  CREATED = 'session-ai-summary.created',
  UPDATED = 'session-ai-summary.updated',
  REMOVED = 'session-ai-summary.removed',
}

export const SessionAiSummaryAuditTopic: Record<
  AuditEvent,
  SessionAiSummaryTopic
> = {
  [AuditEvent.CREATED]: SessionAiSummaryTopic.CREATED,
  [AuditEvent.UPDATED]: SessionAiSummaryTopic.UPDATED,
  [AuditEvent.REMOVED]: SessionAiSummaryTopic.REMOVED,
};
