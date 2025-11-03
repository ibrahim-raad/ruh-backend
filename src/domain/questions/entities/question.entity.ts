import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { QuestionType } from '../shared/question-type.enum';
import { Questionnaire } from 'src/domain/questionnaires/entities/questionnaire.entity';

@Entity('questions')
@Index(['question', 'questionnaire'], { unique: true })
@Index(['questionnaire'])
@Index(['type'])
@Index(['id', 'order'], { unique: true })
export class Question extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  question: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false, type: 'decimal' })
  order: number;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  @Column({ nullable: false, type: 'enum', enum: QuestionType })
  type: QuestionType;

  @ManyToOne(() => Questionnaire, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'questionnaire_id' })
  questionnaire: Questionnaire;

  @RelationId((question: Question) => question.questionnaire)
  questionnaireId: string;
}
