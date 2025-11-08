import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { TherapistSettings } from './entities/therapist-settings.entity';
import { TherapistSettingsService } from './therapist-settings.service';
import { TherapistSettingsController } from './therapist-settings.controller';
import { TherapistSettingsAudit } from './entities/therapist-settings.entity.audit';
import { TherapistSettingsSubscriber } from './entities/therapist-settings.entity.subscriber';
import { TherapistSettingsMapper } from './therapist-settings.mapper';
import { TherapistModule } from '../therapists/therapist.module';
import { TherapistSettingsListener } from './therapist-settings.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([TherapistSettings, TherapistSettingsAudit]),
    ClsModule,
    EventEmitterModule,
    TherapistModule,
  ],
  providers: [
    TherapistSettingsService,
    TherapistSettingsSubscriber,
    TherapistSettingsMapper,
    TherapistSettingsListener,
  ],
  controllers: [TherapistSettingsController],
  exports: [TherapistSettingsService, TherapistSettingsMapper, TypeOrmModule],
})
export class TherapistSettingsModule {}
