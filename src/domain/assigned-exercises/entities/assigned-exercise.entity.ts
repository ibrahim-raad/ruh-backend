import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { AssignedExerciseStatus } from '../shared/assigned-exercise-status.enum';
import { Exercise } from 'src/domain/exercises/entities/exercise.entity';
import { TherapyCase } from 'src/domain/therapy-cases/entities/therapy-case.entity';

@Entity('assigned_exercises')
@Index(['completion_notes'])
@Index(['status'])
@Index(['exercise'])
@Index(['therapy_case'])
export class AssignedExercise extends AbstractEntity {
  @IsOptional()
  @IsString()
  @Column({ nullable: true, type: 'text' })
  completion_notes?: string;

  @IsOptional()
  @IsEnum(AssignedExerciseStatus)
  @Column({
    nullable: false,
    type: 'enum',
    enum: AssignedExerciseStatus,
    default: AssignedExerciseStatus.PENDING,
  })
  status: AssignedExerciseStatus = AssignedExerciseStatus.PENDING;

  @ManyToOne(() => Exercise, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
  @RelationId((assignedExercise: AssignedExercise) => assignedExercise.exercise)
  exerciseId: string;

  @ManyToOne(() => TherapyCase, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapy_case_id' })
  therapy_case: TherapyCase;
  @RelationId(
    (assignedExercise: AssignedExercise) => assignedExercise.therapy_case,
  )
  therapyCaseId: string;
}
