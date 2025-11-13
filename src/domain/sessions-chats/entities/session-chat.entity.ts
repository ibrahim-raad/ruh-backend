import { IsNotEmpty, IsString } from 'class-validator';
import { Session } from 'src/domain/sessions/entities/session.entity';

import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { User } from 'src/domain/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('sessions_chats')
@Index(['session'])
@Index(['user'])
@Index(['message'])
export class SessionChat extends AbstractEntity {
  @ManyToOne(() => Session, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;
  @RelationId((sessionChat: SessionChat) => sessionChat.session)
  sessionId: string;

  @ManyToOne(() => User, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @RelationId((sessionChat: SessionChat) => sessionChat.user)
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, type: 'text' })
  message: string;
}
