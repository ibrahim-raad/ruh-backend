import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum CountryTopic {
  CREATED = 'country.created',
  UPDATED = 'country.updated',
  REMOVED = 'country.removed',
}

export const CountryAuditTopic: Record<AuditEvent, CountryTopic> = {
  [AuditEvent.CREATED]: CountryTopic.CREATED,
  [AuditEvent.UPDATED]: CountryTopic.UPDATED,
  [AuditEvent.REMOVED]: CountryTopic.REMOVED,
};
