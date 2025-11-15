import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { AssignedExercise } from './assigned-exercise.entity';

@Entity({ name: 'assigned_exercises_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class AssignedExerciseAudit extends AuditEntity<AssignedExercise> {}
