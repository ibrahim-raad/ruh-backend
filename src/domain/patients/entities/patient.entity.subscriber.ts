import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Patient } from './patient.entity';
import { PatientAudit } from './patient.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { PatientAuditTopic } from '../shared/patient-topic.enum';

@Injectable()
@EventSubscriber()
export class PatientSubscriber extends CrudSubscriber<Patient, PatientAudit> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Patient,
      PatientAudit,
      PatientAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
