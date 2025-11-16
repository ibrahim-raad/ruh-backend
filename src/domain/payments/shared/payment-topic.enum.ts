import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum PaymentTopic {
  CREATED = 'payment.created',
  UPDATED = 'payment.updated',
  REMOVED = 'payment.removed',
}

export const PaymentAuditTopic: Record<AuditEvent, PaymentTopic> = {
  [AuditEvent.CREATED]: PaymentTopic.CREATED,
  [AuditEvent.UPDATED]: PaymentTopic.UPDATED,
  [AuditEvent.REMOVED]: PaymentTopic.REMOVED,
};
