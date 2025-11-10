import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { Exercise } from './exercise.entity';
import { ExerciseAudit } from './exercise.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { ExerciseAuditTopic } from '../shared/exercise-topic.enum';

@Injectable()
@EventSubscriber()
export class ExerciseSubscriber extends CrudSubscriber<
  Exercise,
  ExerciseAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      Exercise,
      ExerciseAudit,
      ExerciseAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
