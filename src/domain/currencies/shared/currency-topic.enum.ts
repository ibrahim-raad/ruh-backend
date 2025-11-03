import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum CurrencyTopic {
  CREATED = 'currency.created',
  UPDATED = 'currency.updated',
  REMOVED = 'currency.removed',
}

export const CurrencyAuditTopic: Record<AuditEvent, CurrencyTopic> = {
  [AuditEvent.CREATED]: CurrencyTopic.CREATED,
  [AuditEvent.UPDATED]: CurrencyTopic.UPDATED,
  [AuditEvent.REMOVED]: CurrencyTopic.REMOVED,
};
