import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TherapistSpecialization } from './therapist-specialization.entity';
import { TherapistSpecializationAudit } from './therapist-specialization.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { TherapistSpecializationAuditTopic } from '../shared/therapist-specialization-topic.enum';

@Injectable()
@EventSubscriber()
export class TherapistSpecializationSubscriber extends CrudSubscriber<
  TherapistSpecialization,
  TherapistSpecializationAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      TherapistSpecialization,
      TherapistSpecializationAudit,
      TherapistSpecializationAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
