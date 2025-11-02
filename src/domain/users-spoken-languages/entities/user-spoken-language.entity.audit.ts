import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { UserSpokenLanguage } from './user-spoken-language.entity';

@Entity({ name: 'users_spoken_languages_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class UserSpokenLanguageAudit extends AuditEntity<UserSpokenLanguage> {}
