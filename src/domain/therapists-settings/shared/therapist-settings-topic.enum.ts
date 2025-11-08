import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum TherapistSettingsTopic {
  CREATED = 'therapist-settings.created',
  UPDATED = 'therapist-settings.updated',
  REMOVED = 'therapist-settings.removed',
}

export const TherapistSettingsAuditTopic: Record<
  AuditEvent,
  TherapistSettingsTopic
> = {
  [AuditEvent.CREATED]: TherapistSettingsTopic.CREATED,
  [AuditEvent.UPDATED]: TherapistSettingsTopic.UPDATED,
  [AuditEvent.REMOVED]: TherapistSettingsTopic.REMOVED,
};
