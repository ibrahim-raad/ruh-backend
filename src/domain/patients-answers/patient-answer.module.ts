import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { PatientAnswer } from './entities/patient-answer.entity';
import { PatientAnswerService } from './patient-answer.service';
import { PatientAnswerController } from './patient-answer.controller';
import { PatientAnswerAudit } from './entities/patient-answer.entity.audit';
import { PatientAnswerSubscriber } from './entities/patient-answer.entity.subscriber';
import { PatientAnswerMapper } from './patient-answer.mapper';
import { QuestionModule } from '../questions/question.module';
import { PossibleAnswerModule } from '../possible-answers/possible-answer.module';
import { PatientModule } from '../patients/patient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientAnswer, PatientAnswerAudit]),
    ClsModule,
    EventEmitterModule,
    QuestionModule,
    PossibleAnswerModule,
    PatientModule,
  ],
  providers: [
    PatientAnswerService,
    PatientAnswerSubscriber,
    PatientAnswerMapper,
  ],
  controllers: [PatientAnswerController],
  exports: [PatientAnswerService, PatientAnswerMapper, TypeOrmModule],
})
export class PatientAnswerModule {}
