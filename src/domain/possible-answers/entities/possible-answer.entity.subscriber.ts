import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { PossibleAnswer } from './possible-answer.entity';
import { PossibleAnswerAudit } from './possible-answer.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { PossibleAnswerAuditTopic } from '../shared/possible-answer-topic.enum';

@Injectable()
@EventSubscriber()
export class PossibleAnswerSubscriber extends CrudSubscriber<
  PossibleAnswer,
  PossibleAnswerAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      PossibleAnswer,
      PossibleAnswerAudit,
      PossibleAnswerAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
