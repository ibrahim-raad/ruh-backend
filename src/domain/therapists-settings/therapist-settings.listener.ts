import { Injectable, Logger } from '@nestjs/common';
import { TherapistSettingsService } from './therapist-settings.service';
import { OnEvent } from '@nestjs/event-emitter';
import { TherapistTopic } from '../therapists/shared/therapist-topic.enum';
import { EntityEvent } from '../shared/entity.event';
import { Therapist } from '../therapists/entities/therapist.entity';
import { TherapistSettings } from './entities/therapist-settings.entity';

@Injectable()
export class TherapistSettingsListener {
  constructor(
    private readonly therapistSettingsService: TherapistSettingsService,
  ) {}
  private readonly logger = new Logger(TherapistSettingsListener.name);

  @OnEvent(TherapistTopic.CREATED)
  async handleTherapistCreatedEvent(
    payload: EntityEvent<Therapist>,
  ): Promise<void> {
    const { data: therapist } = payload;
    this.logger.log(
      `Handling therapist created event for therapist ${therapist?.id}`,
    );
    const therapistSettings = await this.therapistSettingsService.create(
      Object.assign(new TherapistSettings(), {
        therapist,
      }),
    );
    this.logger.log(
      `Therapist settings created for therapist ${therapist?.id} with values: ${JSON.stringify(therapistSettings)}`,
    );
  }
}
