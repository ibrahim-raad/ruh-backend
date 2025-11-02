import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Admin } from './admin.entity';
import { AdminAudit } from './admin.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { AdminAuditTopic } from '../shared/admin-topic.enum';

@Injectable()
@EventSubscriber()
export class AdminSubscriber extends CrudSubscriber<Admin, AdminAudit> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Admin,
      AdminAudit,
      AdminAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
