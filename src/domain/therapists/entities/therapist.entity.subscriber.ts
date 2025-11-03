import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Therapist } from './therapist.entity';
import { TherapistAudit } from './therapist.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { TherapistAuditTopic } from '../shared/therapist-topic.enum';

@Injectable()
@EventSubscriber()
export class TherapistSubscriber extends CrudSubscriber<
  Therapist,
  TherapistAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Therapist,
      TherapistAudit,
      TherapistAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
