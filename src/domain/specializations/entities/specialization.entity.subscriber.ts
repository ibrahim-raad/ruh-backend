import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Specialization } from './specialization.entity';
import { SpecializationAudit } from './specialization.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { SpecializationAuditTopic } from '../shared/specialization-topic.enum';

@Injectable()
@EventSubscriber()
export class SpecializationSubscriber extends CrudSubscriber<
  Specialization,
  SpecializationAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Specialization,
      SpecializationAudit,
      SpecializationAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
