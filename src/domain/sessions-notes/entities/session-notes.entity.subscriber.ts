import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { SessionNotes } from './session-notes.entity';
import { SessionNotesAudit } from './session-notes.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { SessionNotesAuditTopic } from '../shared/session-notes-topic.enum';

@Injectable()
@EventSubscriber()
export class SessionNotesSubscriber extends CrudSubscriber<
  SessionNotes,
  SessionNotesAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      SessionNotes,
      SessionNotesAudit,
      SessionNotesAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
