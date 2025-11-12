import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { SessionAiSummary } from './session-ai-summary.entity';
import { SessionAiSummaryAudit } from './session-ai-summary.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { SessionAiSummaryAuditTopic } from '../shared/session-ai-summary-topic.enum';

@Injectable()
@EventSubscriber()
export class SessionAiSummarySubscriber extends CrudSubscriber<
  SessionAiSummary,
  SessionAiSummaryAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      SessionAiSummary,
      SessionAiSummaryAudit,
      SessionAiSummaryAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
