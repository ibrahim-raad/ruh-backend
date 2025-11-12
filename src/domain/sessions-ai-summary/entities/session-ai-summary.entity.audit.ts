import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { SessionAiSummary } from './session-ai-summary.entity';

@Entity({ name: 'sessions_ai_summary_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class SessionAiSummaryAudit extends AuditEntity<SessionAiSummary> {}
