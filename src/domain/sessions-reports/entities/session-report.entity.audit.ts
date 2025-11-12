import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { SessionReport } from './session-report.entity';

@Entity({ name: 'sessions_reports_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class SessionReportAudit extends AuditEntity<SessionReport> {}
