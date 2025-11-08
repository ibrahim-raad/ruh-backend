import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TherapistSettings } from './therapist-settings.entity';
import { TherapistSettingsAudit } from './therapist-settings.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { TherapistSettingsAuditTopic } from '../shared/therapist-settings-topic.enum';

@Injectable()
@EventSubscriber()
export class TherapistSettingsSubscriber extends CrudSubscriber<
  TherapistSettings,
  TherapistSettingsAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      TherapistSettings,
      TherapistSettingsAudit,
      TherapistSettingsAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
