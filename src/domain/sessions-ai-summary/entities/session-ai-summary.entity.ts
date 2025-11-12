import { IsNotEmpty, IsString } from 'class-validator';
import { Session } from 'src/domain/sessions/entities/session.entity';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('sessions_ai_summary')
@Index(['summary'])
@Index(['session'])
export class SessionAiSummary extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, type: 'text', default: '' })
  summary: string;

  @ManyToOne(() => Session, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;
  @RelationId((sessionAiSummary: SessionAiSummary) => sessionAiSummary.session)
  sessionId: string;
}
