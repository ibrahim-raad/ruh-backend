import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { TherapistAvailability } from './entities/therapist-availability.entity';
import { TherapistAvailabilityService } from './therapist-availability.service';
import { TherapistAvailabilityController } from './therapist-availability.controller';
import { TherapistAvailabilityAudit } from './entities/therapist-availability.entity.audit';
import { TherapistAvailabilitySubscriber } from './entities/therapist-availability.entity.subscriber';
import { TherapistAvailabilityMapper } from './therapist-availability.mapper';
import { TherapistAvailabilityListener } from './therapist-availability.listener';
import { TherapistAvailabilityCalendarMapper } from './therapist-availability-calendar.mapper';
import { TherapistModule } from '../therapists/therapist.module';
import { TherapistSettingsModule } from '../therapists-settings/therapist-settings.module';
import { TherapistExceptionModule } from '../therapists-exceptions/therapist-exception.module';
import { SessionModule } from '../sessions/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TherapistAvailability,
      TherapistAvailabilityAudit,
    ]),
    ClsModule,
    EventEmitterModule,
    TherapistModule,
    TherapistSettingsModule,
    TherapistExceptionModule,
    SessionModule,
  ],
  providers: [
    TherapistAvailabilityService,
    TherapistAvailabilitySubscriber,
    TherapistAvailabilityMapper,
    TherapistAvailabilityCalendarMapper,
    TherapistAvailabilityListener,
  ],
  controllers: [TherapistAvailabilityController],
  exports: [
    TherapistAvailabilityService,
    TherapistAvailabilityMapper,
    TypeOrmModule,
  ],
})
export class TherapistAvailabilityModule {}
