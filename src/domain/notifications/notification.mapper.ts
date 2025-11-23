import { Injectable } from '@nestjs/common';
import { CreateNotification } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationOutput } from './dto/notification.output';
import { UserMapper } from '../users/user.mapper';

@Injectable()
export class NotificationMapper {
  constructor(private readonly userMapper: UserMapper) {}
  public toModel(input: CreateNotification): Notification {
    const data = {
      type: input.type,
      channel: input.channel,
      topic: input.topic,
      data: input.data
        ? (JSON.parse(input.data) as Record<string, any>)
        : undefined,
      title: input.title,
      body: input.body,
      user: input.user_id ? { id: input.user_id } : undefined,
    };
    return Object.assign(new Notification(), data);
  }

  public toOutput(input: Notification): NotificationOutput {
    return Object.assign(new NotificationOutput(), {
      id: input.id,
      type: input.type,
      channel: input.channel,
      topic: input.topic,
      data: input.data,
      title: input.title,
      body: input.body,
      seen_at: input.seen_at,
      user: input.user ? this.userMapper.toOutput(input.user) : undefined,
      user_id: input.userId,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
