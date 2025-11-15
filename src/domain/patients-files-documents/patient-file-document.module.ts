import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { PatientFileDocument } from './entities/patient-file-document.entity';
import { PatientFileDocumentService } from './patient-file-document.service';
import { PatientFileDocumentController } from './patient-file-document.controller';
import { PatientFileDocumentAudit } from './entities/patient-file-document.entity.audit';
import { PatientFileDocumentSubscriber } from './entities/patient-file-document.entity.subscriber';
import { PatientFileDocumentMapper } from './patient-file-document.mapper';
import { TherapyCaseModule } from '../therapy-cases/therapy-case.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientFileDocument, PatientFileDocumentAudit]),
    ClsModule,
    EventEmitterModule,
    TherapyCaseModule,
  ],
  providers: [
    PatientFileDocumentService,
    PatientFileDocumentSubscriber,
    PatientFileDocumentMapper,
  ],
  controllers: [PatientFileDocumentController],
  exports: [
    PatientFileDocumentService,
    PatientFileDocumentMapper,
    TypeOrmModule,
  ],
})
export class PatientFileDocumentModule {}
