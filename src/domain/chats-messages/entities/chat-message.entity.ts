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
import { User } from 'src/domain/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { ChatMessageType } from '../shared/chat-message-type.enum';

@Entity('chats_messages')
@Index(['message'])
@Index(['type'])
@Index(['reply_to'])
@Index(['therapy_case'])
@Index(['user'])
@Index(['received_at'])
@Index(['seen_at'])
export class ChatMessage extends AbstractEntity {
  @ManyToOne(() => TherapyCase, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapy_case_id' })
  therapy_case: TherapyCase;
  @RelationId((chatMessage: ChatMessage) => chatMessage.therapy_case)
  therapyCaseId: string;

  @ManyToOne(() => User, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @RelationId((chatMessage: ChatMessage) => chatMessage.user)
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, type: 'text' })
  message: string;

  @IsOptional()
  @ManyToOne(() => ChatMessage, {
    nullable: true,
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reply_to_id' })
  reply_to: ChatMessage;
  @RelationId((chatMessage: ChatMessage) => chatMessage.reply_to)
  replyToId: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamptz' })
  received_at?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamptz' })
  seen_at?: Date;

  @IsNotEmpty()
  @IsEnum(ChatMessageType)
  @Column({ nullable: false, type: 'enum', enum: ChatMessageType })
  type: ChatMessageType;
}
