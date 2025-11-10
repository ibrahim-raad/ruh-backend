import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { ExerciseVisibility } from '../shared/exercise-visibility.enum';
import { ExerciseCategory } from '../shared/exercise-category.enum';
import { User } from 'src/domain/users/entities/user.entity';

@Entity('exercises')
@Index(['title'])
export class Exercise extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, type: 'text' })
  description: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, type: 'text' })
  video_url?: string;

  @IsNotEmpty()
  @IsEnum(ExerciseVisibility)
  @Column({ nullable: false, type: 'enum', enum: ExerciseVisibility })
  visibility: ExerciseVisibility;

  @IsNotEmpty()
  @IsEnum(ExerciseCategory)
  @Column({ nullable: false, type: 'enum', enum: ExerciseCategory })
  category: ExerciseCategory;

  @IsOptional()
  @IsJSON()
  @Column({ nullable: true, type: 'jsonb' })
  config?: Record<string, any>;

  @ManyToOne(() => User, {
    nullable: true,
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;
  @RelationId((exercise: Exercise) => exercise.created_by)
  created_by_id: string;
}
