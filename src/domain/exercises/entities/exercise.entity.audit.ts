import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Exercise } from './exercise.entity';

@Entity({ name: 'exercises_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class ExerciseAudit extends AuditEntity<Exercise> {}
