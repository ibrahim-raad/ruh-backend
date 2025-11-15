import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { AssignedExercise } from './entities/assigned-exercise.entity';
import { AssignedExerciseService } from './assigned-exercise.service';
import { AssignedExerciseController } from './assigned-exercise.controller';
import { AssignedExerciseAudit } from './entities/assigned-exercise.entity.audit';
import { AssignedExerciseSubscriber } from './entities/assigned-exercise.entity.subscriber';
import { AssignedExerciseMapper } from './assigned-exercise.mapper';
import { ExerciseModule } from '../exercises/exercise.module';
import { TherapyCaseModule } from '../therapy-cases/therapy-case.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignedExercise, AssignedExerciseAudit]),
    ClsModule,
    EventEmitterModule,
    ExerciseModule,
    TherapyCaseModule,
  ],
  providers: [
    AssignedExerciseService,
    AssignedExerciseSubscriber,
    AssignedExerciseMapper,
  ],
  controllers: [AssignedExerciseController],
  exports: [AssignedExerciseService, AssignedExerciseMapper, TypeOrmModule],
})
export class AssignedExerciseModule {}
