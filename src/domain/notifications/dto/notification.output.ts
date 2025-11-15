import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { NotificationType } from '../shared/notification-type.enum';
import { NotificationChannel } from '../shared/notification-channel.enum';
import { NotificationSubscriptionTopic } from '../shared/notification-subscription-topic.enum';
import { UserOutput } from 'src/domain/users/dto/user.output';

export class NotificationOutput extends AuditableOutput {
  readonly type: NotificationType;
  readonly channel: NotificationChannel;
  readonly topic?: NotificationSubscriptionTopic;
  readonly data?: Record<string, any>;
  readonly title: string;
  readonly body: string;
  readonly seen_at?: Date;
  readonly user?: UserOutput;
  readonly user_id?: string;
}
