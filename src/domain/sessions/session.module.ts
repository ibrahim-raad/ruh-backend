import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionAudit } from './entities/session.entity.audit';
import { SessionSubscriber } from './entities/session.entity.subscriber';
import { SessionMapper } from './session.mapper';
import { TherapyCaseModule } from '../therapy-cases/therapy-case.module';
import { TherapistSettingsModule } from '../therapists-settings/therapist-settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, SessionAudit]),
    ClsModule,
    EventEmitterModule,
    TherapyCaseModule,
    TherapistSettingsModule,
  ],
  providers: [SessionService, SessionSubscriber, SessionMapper],
  controllers: [SessionController],
  exports: [SessionService, SessionMapper, TypeOrmModule],
})
export class SessionModule {}
