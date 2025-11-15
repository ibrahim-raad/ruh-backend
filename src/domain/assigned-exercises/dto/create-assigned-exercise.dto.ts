import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssignedExercise {
  @IsNotEmpty()
  @IsString()
  readonly exercise_id: string;
}
