import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Reflection } from './entities/reflection.entity';
import { ReflectionService } from './reflection.service';
import { ReflectionController } from './reflection.controller';
import { ReflectionAudit } from './entities/reflection.entity.audit';
import { ReflectionSubscriber } from './entities/reflection.entity.subscriber';
import { ReflectionMapper } from './reflection.mapper';
import { PatientModule } from '../patients/patient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reflection, ReflectionAudit]),
    ClsModule,
    EventEmitterModule,
    PatientModule,
  ],
  providers: [ReflectionService, ReflectionSubscriber, ReflectionMapper],
  controllers: [ReflectionController],
  exports: [ReflectionService, ReflectionMapper, TypeOrmModule],
})
export class ReflectionModule {}
