import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum SessionNotesTopic {
  CREATED = 'session-notes.created',
  UPDATED = 'session-notes.updated',
  REMOVED = 'session-notes.removed',
}

export const SessionNotesAuditTopic: Record<AuditEvent, SessionNotesTopic> = {
  [AuditEvent.CREATED]: SessionNotesTopic.CREATED,
  [AuditEvent.UPDATED]: SessionNotesTopic.UPDATED,
  [AuditEvent.REMOVED]: SessionNotesTopic.REMOVED,
};
