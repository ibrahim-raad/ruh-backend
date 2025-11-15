import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { PatientFileDocument } from './patient-file-document.entity';
import { PatientFileDocumentAudit } from './patient-file-document.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { PatientFileDocumentAuditTopic } from '../shared/patient-file-document-topic.enum';

@Injectable()
@EventSubscriber()
export class PatientFileDocumentSubscriber extends CrudSubscriber<
  PatientFileDocument,
  PatientFileDocumentAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      PatientFileDocument,
      PatientFileDocumentAudit,
      PatientFileDocumentAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
