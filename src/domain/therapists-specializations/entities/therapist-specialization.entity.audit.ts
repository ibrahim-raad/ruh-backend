import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { TherapistSpecialization } from './therapist-specialization.entity';

@Entity({ name: 'therapists_specializations_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class TherapistSpecializationAudit extends AuditEntity<TherapistSpecialization> {}
