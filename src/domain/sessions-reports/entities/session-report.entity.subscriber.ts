import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { SessionReport } from './session-report.entity';
import { SessionReportAudit } from './session-report.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { SessionReportAuditTopic } from '../shared/session-report-topic.enum';

@Injectable()
@EventSubscriber()
export class SessionReportSubscriber extends CrudSubscriber<
  SessionReport,
  SessionReportAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      SessionReport,
      SessionReportAudit,
      SessionReportAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
