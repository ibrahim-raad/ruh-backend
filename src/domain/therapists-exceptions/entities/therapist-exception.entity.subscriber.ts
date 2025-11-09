import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TherapistException } from './therapist-exception.entity';
import { TherapistExceptionAudit } from './therapist-exception.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { TherapistExceptionAuditTopic } from '../shared/therapist-exception-topic.enum';

@Injectable()
@EventSubscriber()
export class TherapistExceptionSubscriber extends CrudSubscriber<
  TherapistException,
  TherapistExceptionAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      TherapistException,
      TherapistExceptionAudit,
      TherapistExceptionAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
