import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { ExerciseCategory } from '../shared/exercise-category.enum';
import { ExerciseVisibility } from '../shared/exercise-visibility.enum';
import { UserOutput } from 'src/domain/users/dto/user.output';

export class ExerciseOutput extends AuditableOutput {
  readonly title: string;
  readonly description: string;
  readonly visibility: ExerciseVisibility;
  readonly category: ExerciseCategory;
  readonly config?: Record<string, any>;
  readonly created_by_id?: string;
  readonly created_by?: UserOutput;
}
