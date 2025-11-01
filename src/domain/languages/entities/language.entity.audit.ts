import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Language } from './language.entity';

@Entity({ name: 'languages_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class LanguageAudit extends AuditEntity<Language> {}
