import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum SessionReportTopic {
  CREATED = 'session-report.created',
  UPDATED = 'session-report.updated',
  REMOVED = 'session-report.removed',
}

export const SessionReportAuditTopic: Record<AuditEvent, SessionReportTopic> = {
  [AuditEvent.CREATED]: SessionReportTopic.CREATED,
  [AuditEvent.UPDATED]: SessionReportTopic.UPDATED,
  [AuditEvent.REMOVED]: SessionReportTopic.REMOVED,
};
