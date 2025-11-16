import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Payment } from './payment.entity';
import { PaymentAudit } from './payment.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { PaymentAuditTopic } from '../shared/payment-topic.enum';

@Injectable()
@EventSubscriber()
export class PaymentSubscriber extends CrudSubscriber<Payment, PaymentAudit> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Payment,
      PaymentAudit,
      PaymentAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
