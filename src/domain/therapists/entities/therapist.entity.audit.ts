import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Therapist } from './therapist.entity';

@Entity({ name: 'therapists_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class TherapistAudit extends AuditEntity<Therapist> {}
