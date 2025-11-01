import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Language } from './language.entity';
import { LanguageAudit } from './language.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { LanguageAuditTopic } from '../shared/language-topic.enum';

@Injectable()
@EventSubscriber()
export class LanguageSubscriber extends CrudSubscriber<
  Language,
  LanguageAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Language,
      LanguageAudit,
      LanguageAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
