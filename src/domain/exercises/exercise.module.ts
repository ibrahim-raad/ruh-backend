import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Exercise } from './entities/exercise.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { ExerciseAudit } from './entities/exercise.entity.audit';
import { ExerciseSubscriber } from './entities/exercise.entity.subscriber';
import { ExerciseMapper } from './exercise.mapper';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, ExerciseAudit]),
    ClsModule,
    EventEmitterModule,
    UserModule,
  ],
  providers: [ExerciseService, ExerciseSubscriber, ExerciseMapper],
  controllers: [ExerciseController],
  exports: [ExerciseService, ExerciseMapper, TypeOrmModule],
})
export class ExerciseModule {}
