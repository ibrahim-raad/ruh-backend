import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { TherapyCase } from 'src/domain/therapy-cases/entities/therapy-case.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { SessionType } from '../shared/session-type.enum';
import { SessionStatus } from '../shared/session-status.enum';

@Entity('sessions')
@Index(['link'])
@Index(['status'])
@Index(['type'])
@Index(['therapy_case'])
@Index(['start_time'])
@Index(['end_time'])
@Index(['actual_start_time'])
@Index(['actual_end_time'])
@Index(['therapy_case', 'start_time'], { unique: true })
export class Session extends AbstractEntity {
  @ManyToOne(() => TherapyCase, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapy_case_id' })
  therapy_case: TherapyCase;
  @RelationId((session: Session) => session.therapy_case)
  therapy_caseId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: false, type: 'timestamptz' })
  start_time: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: false, type: 'timestamptz' })
  end_time: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamptz' })
  actual_start_time?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamptz' })
  actual_end_time?: Date;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255, unique: true })
  link?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255, unique: true })
  audio_link?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  patient_feedback?: string;

  @IsOptional()
  @IsEnum(SessionType)
  @Column({
    nullable: false,
    type: 'enum',
    enum: SessionType,
    default: SessionType.FIRST,
  })
  type: SessionType = SessionType.FIRST;

  @IsOptional()
  @IsEnum(SessionStatus)
  @Column({
    nullable: false,
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.PENDING,
  })
  status: SessionStatus = SessionStatus.PENDING;
}
