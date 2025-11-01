import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Specialization } from './entities/specialization.entity';
import { SpecializationService } from './specialization.service';
import { SpecializationController } from './specialization.controller';
import { SpecializationAudit } from './entities/specialization.entity.audit';
import { SpecializationSubscriber } from './entities/specialization.entity.subscriber';
import { SpecializationMapper } from './specialization.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialization, SpecializationAudit]),
    ClsModule,
    EventEmitterModule,
  ],
  providers: [
    SpecializationService,
    SpecializationSubscriber,
    SpecializationMapper,
  ],
  controllers: [SpecializationController],
  exports: [SpecializationService, SpecializationMapper, TypeOrmModule],
})
export class SpecializationModule {}
