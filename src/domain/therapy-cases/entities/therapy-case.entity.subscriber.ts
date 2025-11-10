import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TherapyCase } from './therapy-case.entity';
import { TherapyCaseAudit } from './therapy-case.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { TherapyCaseAuditTopic } from '../shared/therapy-case-topic.enum';

@Injectable()
@EventSubscriber()
export class TherapyCaseSubscriber extends CrudSubscriber<
  TherapyCase,
  TherapyCaseAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      TherapyCase,
      TherapyCaseAudit,
      TherapyCaseAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
