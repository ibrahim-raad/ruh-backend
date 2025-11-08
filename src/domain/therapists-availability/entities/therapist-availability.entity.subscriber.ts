import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TherapistAvailability } from './therapist-availability.entity';
import { TherapistAvailabilityAudit } from './therapist-availability.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { TherapistAvailabilityAuditTopic } from '../shared/therapist-availability-topic.enum';

@Injectable()
@EventSubscriber()
export class TherapistAvailabilitySubscriber extends CrudSubscriber<
  TherapistAvailability,
  TherapistAvailabilityAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      TherapistAvailability,
      TherapistAvailabilityAudit,
      TherapistAvailabilityAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
