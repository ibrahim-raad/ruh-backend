import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { AssignedExercise } from './assigned-exercise.entity';
import { AssignedExerciseAudit } from './assigned-exercise.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { AssignedExerciseAuditTopic } from '../shared/assigned-exercise-topic.enum';

@Injectable()
@EventSubscriber()
export class AssignedExerciseSubscriber extends CrudSubscriber<
  AssignedExercise,
  AssignedExerciseAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      AssignedExercise,
      AssignedExerciseAudit,
      AssignedExerciseAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
