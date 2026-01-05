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
import { SessionGateway } from './session.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, SessionAudit]),
    ClsModule,
    EventEmitterModule,
    TherapyCaseModule,
    TherapistSettingsModule,
    JwtModule.register({}),
    ConfigModule,
    UserModule,
  ],
  providers: [SessionService, SessionSubscriber, SessionMapper, SessionGateway],
  controllers: [SessionController],
  exports: [SessionService, SessionMapper, TypeOrmModule],
})
export class SessionModule {}
