import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { SessionNotes } from './session-notes.entity';

@Entity({ name: 'sessions_notes_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class SessionNotesAudit extends AuditEntity<SessionNotes> {}
