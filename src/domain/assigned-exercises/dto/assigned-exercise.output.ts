import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { AssignedExerciseStatus } from '../shared/assigned-exercise-status.enum';
import { ExerciseOutput } from 'src/domain/exercises/dto/exercise.output';
import { TherapyCaseOutput } from 'src/domain/therapy-cases/dto/therapy-case.output';

export class AssignedExerciseOutput extends AuditableOutput {
  readonly completion_notes?: string;
  readonly status: AssignedExerciseStatus;
  readonly exercise: ExerciseOutput;
  readonly exercise_id?: string;
  readonly therapy_case: TherapyCaseOutput;
  readonly therapy_case_id?: string;
}
