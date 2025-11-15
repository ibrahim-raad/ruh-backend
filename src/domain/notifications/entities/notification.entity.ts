import {
  IsDate,
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
import { NotificationType } from '../shared/notification-type.enum';
import { NotificationChannel } from '../shared/notification-channel.enum';
import { NotificationSubscriptionTopic } from '../shared/notification-subscription-topic.enum';
import { Type } from 'class-transformer';
import { User } from 'src/domain/users/entities/user.entity';

@Entity('notifications')
@Index(['type'])
@Index(['topic'])
export class Notification extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, type: 'text' })
  body: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  @Column({ nullable: false, type: 'enum', enum: NotificationType })
  type: NotificationType;

  @IsNotEmpty()
  @IsEnum(NotificationChannel)
  @Column({ nullable: false, type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @IsOptional()
  @IsEnum(NotificationSubscriptionTopic)
  @Column({
    nullable: true,
    type: 'enum',
    enum: NotificationSubscriptionTopic,
  })
  topic?: NotificationSubscriptionTopic;

  @IsOptional()
  @IsJSON()
  @Column({ nullable: true, type: 'jsonb' })
  data?: Record<string, any>;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamptz' })
  seen_at?: Date;

  @IsOptional()
  @ManyToOne(() => User, {
    nullable: true,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;
  @RelationId((notification: Notification) => notification.user)
  userId?: string;
}
