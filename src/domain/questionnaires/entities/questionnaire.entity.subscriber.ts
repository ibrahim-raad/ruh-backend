import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Questionnaire } from './questionnaire.entity';
import { QuestionnaireAudit } from './questionnaire.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { QuestionnaireAuditTopic } from '../shared/questionnaire-topic.enum';

@Injectable()
@EventSubscriber()
export class QuestionnaireSubscriber extends CrudSubscriber<
  Questionnaire,
  QuestionnaireAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Questionnaire,
      QuestionnaireAudit,
      QuestionnaireAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
