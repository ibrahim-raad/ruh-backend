import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Currency } from './currency.entity';
import { CurrencyAudit } from './currency.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { CurrencyAuditTopic } from '../shared/currency-topic.enum';

@Injectable()
@EventSubscriber()
export class CurrencySubscriber extends CrudSubscriber<
  Currency,
  CurrencyAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Currency,
      CurrencyAudit,
      CurrencyAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
