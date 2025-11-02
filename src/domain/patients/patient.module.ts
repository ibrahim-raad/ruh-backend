import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientAudit } from './entities/patient.entity.audit';
import { PatientSubscriber } from './entities/patient.entity.subscriber';
import { PatientMapper } from './patient.mapper';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, PatientAudit]),
    ClsModule,
    EventEmitterModule,
    UserModule,
  ],
  providers: [PatientService, PatientSubscriber, PatientMapper],
  controllers: [PatientController],
  exports: [PatientService, PatientMapper, TypeOrmModule],
})
export class PatientModule {}
