import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { PatientAnswer } from './patient-answer.entity';
import { PatientAnswerAudit } from './patient-answer.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { PatientAnswerAuditTopic } from '../shared/patient-answer-topic.enum';

@Injectable()
@EventSubscriber()
export class PatientAnswerSubscriber extends CrudSubscriber<
  PatientAnswer,
  PatientAnswerAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      PatientAnswer,
      PatientAnswerAudit,
      PatientAnswerAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
