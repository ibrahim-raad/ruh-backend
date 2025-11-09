import { Injectable, Logger } from '@nestjs/common';
import { TherapistAvailabilityService } from './therapist-availability.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EntityEvent } from '../shared/entity.event';
import { TherapistAvailability } from './entities/therapist-availability.entity';
import { DayOfWeek } from './shared/day-of-week.enum';
import { Therapist } from '../therapists/entities/therapist.entity';
import { TherapistTopic } from '../therapists/shared/therapist-topic.enum';

@Injectable()
export class TherapistAvailabilityListener {
  constructor(
    private readonly therapistAvailabilityService: TherapistAvailabilityService,
  ) {}
  private readonly logger = new Logger(TherapistAvailabilityListener.name);

  @OnEvent(TherapistTopic.CREATED)
  async handleTherapistCreatedEvent(
    payload: EntityEvent<Therapist>,
  ): Promise<void> {
    const { data: therapist } = payload;
    const defaultAvailability = this.defaultAvailability(therapist);
    for (const availability of defaultAvailability) {
      try {
        await this.therapistAvailabilityService.create(availability);
      } catch (error) {
        this.logger.error(
          `Error creating default availability for therapist ${therapist?.id}: ${error}`,
        );
      }
    }
    this.logger.log(
      `Default availability created for therapist ${therapist?.id}`,
    );
  }

  private defaultAvailability(therapist: Therapist): TherapistAvailability[] {
    return [
      this.defaultAvailabilityObject({
        day_of_week: DayOfWeek.MONDAY,
        therapist,
      }),
      this.defaultAvailabilityObject({
        day_of_week: DayOfWeek.TUESDAY,
        therapist,
      }),

      this.defaultAvailabilityObject({
        day_of_week: DayOfWeek.WEDNESDAY,
        therapist,
      }),

      this.defaultAvailabilityObject({
        day_of_week: DayOfWeek.THURSDAY,
        therapist,
      }),

      this.defaultAvailabilityObject({
        day_of_week: DayOfWeek.FRIDAY,
        therapist,
      }),
    ];
  }
  private defaultAvailabilityObject(
    availability: Partial<TherapistAvailability>,
  ): TherapistAvailability {
    return Object.assign(new TherapistAvailability(), availability);
  }
}
