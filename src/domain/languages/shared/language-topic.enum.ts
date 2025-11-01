import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum LanguageTopic {
  CREATED = 'language.created',
  UPDATED = 'language.updated',
  REMOVED = 'language.removed',
}

export const LanguageAuditTopic: Record<AuditEvent, LanguageTopic> = {
  [AuditEvent.CREATED]: LanguageTopic.CREATED,
  [AuditEvent.UPDATED]: LanguageTopic.UPDATED,
  [AuditEvent.REMOVED]: LanguageTopic.REMOVED,
};
