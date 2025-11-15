import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from '../shared/notification-type.enum';
import { NotificationChannel } from '../shared/notification-channel.enum';
import { NotificationSubscriptionTopic } from '../shared/notification-subscription-topic.enum';

export class CreateNotification {
  @IsNotEmpty()
  @IsEnum(NotificationType)
  readonly type: NotificationType;

  @IsNotEmpty()
  @IsEnum(NotificationChannel)
  readonly channel: NotificationChannel;

  @IsOptional()
  @IsEnum(NotificationSubscriptionTopic)
  readonly topic?: NotificationSubscriptionTopic;

  @IsOptional()
  @IsJSON()
  readonly data?: Record<string, any>;

  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly body: string;
}
