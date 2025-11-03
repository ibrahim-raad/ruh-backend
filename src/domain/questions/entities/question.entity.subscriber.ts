import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Question } from './question.entity';
import { QuestionAudit } from './question.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { QuestionAuditTopic } from '../shared/question-topic.enum';

@Injectable()
@EventSubscriber()
export class QuestionSubscriber extends CrudSubscriber<
  Question,
  QuestionAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Question,
      QuestionAudit,
      QuestionAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
