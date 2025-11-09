import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { TherapistException } from './entities/therapist-exception.entity';
import { TherapistExceptionService } from './therapist-exception.service';
import { TherapistExceptionController } from './therapist-exception.controller';
import { TherapistExceptionAudit } from './entities/therapist-exception.entity.audit';
import { TherapistExceptionSubscriber } from './entities/therapist-exception.entity.subscriber';
import { TherapistExceptionMapper } from './therapist-exception.mapper';
import { TherapistModule } from '../therapists/therapist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TherapistException, TherapistExceptionAudit]),
    ClsModule,
    EventEmitterModule,
    TherapistModule,
  ],
  providers: [
    TherapistExceptionService,
    TherapistExceptionSubscriber,
    TherapistExceptionMapper,
  ],
  controllers: [TherapistExceptionController],
  exports: [TherapistExceptionService, TherapistExceptionMapper, TypeOrmModule],
})
export class TherapistExceptionModule {}
