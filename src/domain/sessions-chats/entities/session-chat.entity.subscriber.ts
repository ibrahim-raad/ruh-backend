import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { SessionChat } from './session-chat.entity';
import { SessionChatAudit } from './session-chat.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { SessionChatAuditTopic } from '../shared/session-chat-topic.enum';

@Injectable()
@EventSubscriber()
export class SessionChatSubscriber extends CrudSubscriber<
  SessionChat,
  SessionChatAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      SessionChat,
      SessionChatAudit,
      SessionChatAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
