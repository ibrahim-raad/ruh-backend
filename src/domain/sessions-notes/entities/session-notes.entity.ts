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

@Entity('sessions_notes')
@Index(['content'])
@Index(['session'])
export class SessionNotes extends AbstractEntity {
  @IsString()
  @Column({ nullable: false, type: 'text', default: '' })
  content: string;

  @ManyToOne(() => Session, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;
  @RelationId((sessionNotes: SessionNotes) => sessionNotes.session)
  sessionId: string;
}
