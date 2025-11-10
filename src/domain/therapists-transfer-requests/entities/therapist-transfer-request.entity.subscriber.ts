import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TherapistTransferRequest } from './therapist-transfer-request.entity';
import { TherapistTransferRequestAudit } from './therapist-transfer-request.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { TherapistTransferRequestAuditTopic } from '../shared/therapist-transfer-request-topic.enum';

@Injectable()
@EventSubscriber()
export class TherapistTransferRequestSubscriber extends CrudSubscriber<
  TherapistTransferRequest,
  TherapistTransferRequestAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      TherapistTransferRequest,
      TherapistTransferRequestAudit,
      TherapistTransferRequestAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
