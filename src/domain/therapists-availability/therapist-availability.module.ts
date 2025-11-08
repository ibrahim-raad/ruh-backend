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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TherapistAvailability,
      TherapistAvailabilityAudit,
    ]),
    ClsModule,
    EventEmitterModule,
  ],
  providers: [
    TherapistAvailabilityService,
    TherapistAvailabilitySubscriber,
    TherapistAvailabilityMapper,
  ],
  controllers: [TherapistAvailabilityController],
  exports: [
    TherapistAvailabilityService,
    TherapistAvailabilityMapper,
    TypeOrmModule,
  ],
})
export class TherapistAvailabilityModule {}
