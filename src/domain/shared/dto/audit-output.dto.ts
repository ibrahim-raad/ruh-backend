import { AuditEvent } from '../audit-event.enum';

export class AuditOutput<T> {
  id?: string;
  event: AuditEvent;
  createdAt: Date;
  version?: number;
  data?: T;
}
