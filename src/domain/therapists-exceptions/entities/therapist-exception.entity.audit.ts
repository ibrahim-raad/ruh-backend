import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { TherapistException } from './therapist-exception.entity';

@Entity({ name: 'therapists_exceptions_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class TherapistExceptionAudit extends AuditEntity<TherapistException> {}
