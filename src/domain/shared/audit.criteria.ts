import { Pageable } from './pageable.interface';
import { AuditEvent } from './audit-event.enum';
import { Range } from './range.interface';

export class AuditCriteria implements Pageable {
  offset: number;
  limit: number;
  sort: string;
  events?: AuditEvent[];
  version?: number;
  date?: Range<Date>;
}
