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
import { TherapistModule } from '../therapists/therapist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TherapistAvailability,
      TherapistAvailabilityAudit,
    ]),
    ClsModule,
    EventEmitterModule,
    TherapistModule,
  ],
  providers: [
    TherapistAvailabilityService,
    TherapistAvailabilitySubscriber,
    TherapistAvailabilityMapper,
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
