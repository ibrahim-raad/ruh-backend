import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Pageable } from 'src/domain/shared/pageable.interface';
import { DEFAULT_PAGE_SIZE } from 'src/app.constants';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { NotificationType } from '../shared/notification-type.enum';
import { IsArrayOrSingle } from 'src/domain/shared/decorators/is-array-or-single.decorator';
import { NotificationChannel } from '../shared/notification-channel.enum';
import { NotificationSubscriptionTopic } from '../shared/notification-subscription-topic.enum';

export class SearchNotification implements Pageable {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly offset: number = 0;

  @IsOptional()
  @IsNumber()
  @Max(DEFAULT_PAGE_SIZE)
  readonly limit: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  readonly sort: string = 'created_at DESC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly body?: string;

  @IsOptional()
  @IsArrayOrSingle()
  @IsEnum(NotificationType, { each: true })
  readonly types?: NotificationType[];

  @IsOptional()
  @IsArrayOrSingle()
  @IsEnum(NotificationChannel)
  readonly channel?: NotificationChannel;

  @IsOptional()
  @IsEnum(NotificationSubscriptionTopic, { each: true })
  readonly topics?: NotificationSubscriptionTopic[];

  @IsOptional()
  @IsUUID()
  readonly user_id?: string;
}
