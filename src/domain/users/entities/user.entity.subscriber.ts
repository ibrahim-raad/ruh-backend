import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserAudit } from './user.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { UserAuditTopic } from '../shared/user-topic.enum';

@Injectable()
@EventSubscriber()
export class UserSubscriber extends CrudSubscriber<User, UserAudit> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      User,
      UserAudit,
      UserAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
