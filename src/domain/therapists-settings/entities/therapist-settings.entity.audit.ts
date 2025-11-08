import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { TherapistSettings } from './therapist-settings.entity';

@Entity({ name: 'therapists_settings_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class TherapistSettingsAudit extends AuditEntity<TherapistSettings> {}
