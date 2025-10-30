import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Country } from './country.entity';
import { CountryAudit } from './country.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { CountryAuditTopic } from '../shared/country-topic.enum';

@Injectable()
@EventSubscriber()
export class CountrySubscriber extends CrudSubscriber<Country, CountryAudit> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Country,
      CountryAudit,
      CountryAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
