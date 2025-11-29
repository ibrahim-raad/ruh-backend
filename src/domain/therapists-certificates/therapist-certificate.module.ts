import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { TherapistCertificate } from './entities/therapist-certificate.entity';
import { TherapistCertificateService } from './therapist-certificate.service';
import { TherapistCertificateController } from './therapist-certificate.controller';
import { TherapistCertificateAudit } from './entities/therapist-certificate.entity.audit';
import { TherapistCertificateSubscriber } from './entities/therapist-certificate.entity.subscriber';
import { TherapistCertificateMapper } from './therapist-certificate.mapper';
import { TherapistModule } from '../therapists/therapist.module';
import { SpecializationModule } from '../specializations/specialization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TherapistCertificate, TherapistCertificateAudit]),
    ClsModule,
    EventEmitterModule,
    TherapistModule,
    SpecializationModule,
  ],
  providers: [
    TherapistCertificateService,
    TherapistCertificateSubscriber,
    TherapistCertificateMapper,
  ],
  controllers: [TherapistCertificateController],
  exports: [
    TherapistCertificateService,
    TherapistCertificateMapper,
    TypeOrmModule,
  ],
})
export class TherapistCertificateModule {}
