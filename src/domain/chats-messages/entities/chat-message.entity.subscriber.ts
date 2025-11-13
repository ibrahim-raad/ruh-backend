import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ChatMessage } from './chat-message.entity';
import { ChatMessageAudit } from './chat-message.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { ChatMessageAuditTopic } from '../shared/chat-message-topic.enum';

@Injectable()
@EventSubscriber()
export class ChatMessageSubscriber extends CrudSubscriber<
  ChatMessage,
  ChatMessageAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      ChatMessage,
      ChatMessageAudit,
      ChatMessageAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
