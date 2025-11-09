import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Reflection } from './reflection.entity';
import { ReflectionAudit } from './reflection.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { ReflectionAuditTopic } from '../shared/reflection-topic.enum';

@Injectable()
@EventSubscriber()
export class ReflectionSubscriber extends CrudSubscriber<
  Reflection,
  ReflectionAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Reflection,
      ReflectionAudit,
      ReflectionAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
