import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { TherapyCase } from './entities/therapy-case.entity';
import { TherapyCaseService } from './therapy-case.service';
import { TherapyCaseController } from './therapy-case.controller';
import { TherapyCaseAudit } from './entities/therapy-case.entity.audit';
import { TherapyCaseSubscriber } from './entities/therapy-case.entity.subscriber';
import { TherapyCaseMapper } from './therapy-case.mapper';
import { PatientModule } from '../patients/patient.module';
import { TherapistModule } from '../therapists/therapist.module';
import { TherapyCaseListener } from './therapy-case.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([TherapyCase, TherapyCaseAudit]),
    ClsModule,
    EventEmitterModule,
    PatientModule,
    TherapistModule,
  ],
  providers: [
    TherapyCaseService,
    TherapyCaseSubscriber,
    TherapyCaseMapper,
    TherapyCaseListener,
  ],
  controllers: [TherapyCaseController],
  exports: [TherapyCaseService, TherapyCaseMapper, TypeOrmModule],
})
export class TherapyCaseModule {}
