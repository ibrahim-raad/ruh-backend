import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { TherapistTransferRequest } from './entities/therapist-transfer-request.entity';
import { TherapistTransferRequestService } from './therapist-transfer-request.service';
import { TherapistTransferRequestController } from './therapist-transfer-request.controller';
import { TherapistTransferRequestAudit } from './entities/therapist-transfer-request.entity.audit';
import { TherapistTransferRequestSubscriber } from './entities/therapist-transfer-request.entity.subscriber';
import { TherapistTransferRequestMapper } from './therapist-transfer-request.mapper';
import { TherapistModule } from '../therapists/therapist.module';
import { PatientModule } from '../patients/patient.module';
import { TherapyCaseModule } from '../therapy-cases/therapy-case.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TherapistTransferRequest,
      TherapistTransferRequestAudit,
    ]),
    ClsModule,
    EventEmitterModule,
    TherapistModule,
    PatientModule,
    TherapyCaseModule,
  ],
  providers: [
    TherapistTransferRequestService,
    TherapistTransferRequestSubscriber,
    TherapistTransferRequestMapper,
  ],
  controllers: [TherapistTransferRequestController],
  exports: [
    TherapistTransferRequestService,
    TherapistTransferRequestMapper,
    TypeOrmModule,
  ],
})
export class TherapistTransferRequestModule {}
