import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { TherapistAvailability } from './therapist-availability.entity';

@Entity({ name: 'therapists_availability_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class TherapistAvailabilityAudit extends AuditEntity<TherapistAvailability> {}
