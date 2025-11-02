import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum UserSpokenLanguageTopic {
  CREATED = 'user_spoken_language.created',
  UPDATED = 'user_spoken_language.updated',
  REMOVED = 'user_spoken_language.removed',
}

export const UserSpokenLanguageAuditTopic: Record<
  AuditEvent,
  UserSpokenLanguageTopic
> = {
  [AuditEvent.CREATED]: UserSpokenLanguageTopic.CREATED,
  [AuditEvent.UPDATED]: UserSpokenLanguageTopic.UPDATED,
  [AuditEvent.REMOVED]: UserSpokenLanguageTopic.REMOVED,
};
