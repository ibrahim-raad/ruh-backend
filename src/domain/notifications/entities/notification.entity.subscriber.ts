import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Notification } from './notification.entity';
import { NotificationAudit } from './notification.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { NotificationAuditTopic } from '../shared/notification-topic.enum';

@Injectable()
@EventSubscriber()
export class NotificationSubscriber extends CrudSubscriber<
  Notification,
  NotificationAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Notification,
      NotificationAudit,
      NotificationAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
