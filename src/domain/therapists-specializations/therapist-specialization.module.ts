import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { TherapistSpecialization } from './entities/therapist-specialization.entity';
import { TherapistSpecializationService } from './therapist-specialization.service';
import { TherapistSpecializationController } from './therapist-specialization.controller';
import { TherapistSpecializationAudit } from './entities/therapist-specialization.entity.audit';
import { TherapistSpecializationSubscriber } from './entities/therapist-specialization.entity.subscriber';
import { TherapistSpecializationMapper } from './therapist-specialization.mapper';
import { TherapistModule } from '../therapists/therapist.module';
import { SpecializationModule } from '../specializations/specialization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TherapistSpecialization,
      TherapistSpecializationAudit,
    ]),
    ClsModule,
    EventEmitterModule,
    TherapistModule,
    SpecializationModule,
  ],
  providers: [
    TherapistSpecializationService,
    TherapistSpecializationSubscriber,
    TherapistSpecializationMapper,
  ],
  controllers: [TherapistSpecializationController],
  exports: [
    TherapistSpecializationService,
    TherapistSpecializationMapper,
    TypeOrmModule,
  ],
})
export class TherapistSpecializationModule {}
