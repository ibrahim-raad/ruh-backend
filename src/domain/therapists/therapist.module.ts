import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Therapist } from './entities/therapist.entity';
import { TherapistService } from './therapist.service';
import { TherapistController } from './therapist.controller';
import { TherapistAudit } from './entities/therapist.entity.audit';
import { TherapistSubscriber } from './entities/therapist.entity.subscriber';
import { TherapistMapper } from './therapist.mapper';
import { UserModule } from '../users/user.module';
import { CurrencyModule } from '../currencies/currency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Therapist, TherapistAudit]),
    ClsModule,
    EventEmitterModule,
    UserModule,
    CurrencyModule,
  ],
  providers: [TherapistService, TherapistSubscriber, TherapistMapper],
  controllers: [TherapistController],
  exports: [TherapistService, TherapistMapper, TypeOrmModule],
})
export class TherapistModule {}
