import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TherapistCertificate } from './therapist-certificate.entity';
import { TherapistCertificateAudit } from './therapist-certificate.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { TherapistCertificateAuditTopic } from '../shared/therapist-certificate-topic.enum';

@Injectable()
@EventSubscriber()
export class TherapistCertificateSubscriber extends CrudSubscriber<
  TherapistCertificate,
  TherapistCertificateAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      TherapistCertificate,
      TherapistCertificateAudit,
      TherapistCertificateAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
