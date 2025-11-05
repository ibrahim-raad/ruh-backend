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
import { QuestionnaireType } from '../shared/questionnaire-type.enum';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { User } from 'src/domain/users/entities/user.entity';

@Entity('questionnaires')
@Index(['title'])
@Index(['type'])
@Index(['is_active'])
@Index(['is_active', 'type'], { unique: true })
@Index(['created_by'])
export class Questionnaire extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  title: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  description?: string;

  @IsNotEmpty()
  @IsEnum(QuestionnaireType)
  @Column({ nullable: false, type: 'enum', enum: QuestionnaireType })
  type: QuestionnaireType;

  @IsOptional()
  @IsBooleanish()
  @Column({ nullable: true, default: false, type: 'boolean' })
  is_active: boolean = false;

  @ManyToOne(() => User, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @RelationId((questionnaire: Questionnaire) => questionnaire.created_by)
  created_by_id: string;
}
