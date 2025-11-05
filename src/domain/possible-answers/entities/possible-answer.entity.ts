import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Question } from 'src/domain/questions/entities/question.entity';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('possible_answers')
@Index(['answer', 'question'], { unique: true })
@Index(['question'])
@Index(['order'])
export class PossibleAnswer extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  answer: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false, type: 'decimal' })
  order: number;

  @ManyToOne(() => Question, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @RelationId((possibleAnswer: PossibleAnswer) => possibleAnswer.question)
  questionId: string;
}
