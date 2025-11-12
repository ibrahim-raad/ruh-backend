import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Session } from 'src/domain/sessions/entities/session.entity';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { IsBooleanish } from 'src/domain/shared/decorators';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('sessions_reports')
@Index(['overview'])
@Index(['diagnosis'])
@Index(['recommendations'])
@Index(['next_steps'])
@Index(['progress_score'])
@Index(['ai_assisted'])
@Index(['is_finalized'])
@Index(['session'])
export class SessionReport extends AbstractEntity {
  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  overview?: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  diagnosis: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  recommendations: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  next_steps: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false, type: 'decimal', precision: 4, scale: 1 })
  progress_score: number;

  @IsOptional()
  @IsBooleanish()
  @Column({ nullable: false, default: false, type: 'boolean' })
  ai_assisted: boolean = false;

  @IsOptional()
  @IsBooleanish()
  @Column({ nullable: false, default: false, type: 'boolean' })
  is_finalized: boolean = false;

  @ManyToOne(() => Session, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;
  @RelationId((sr: SessionReport) => sr.session)
  sessionId: string;
}
