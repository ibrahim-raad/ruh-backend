import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Session } from './session.entity';
import { SessionAudit } from './session.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { SessionAuditTopic } from '../shared/session-topic.enum';

@Injectable()
@EventSubscriber()
export class SessionSubscriber extends CrudSubscriber<Session, SessionAudit> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Session,
      SessionAudit,
      SessionAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
