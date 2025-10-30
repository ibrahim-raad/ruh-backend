import {
  DataSource,
  EntityTarget,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditEvent } from './audit-event.enum';
import { AuditEntity } from './audit.entity';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AbstractEntity } from './abstract.entity';
import { AbstractSubscriber } from './abstract.subscriber';

export abstract class CrudSubscriber<
  Model extends AbstractEntity,
  AuditModel extends AuditEntity<Model>,
> extends AbstractSubscriber<Model, AuditModel> {
  protected constructor(
    entityClass: ClassConstructor<Model>,
    auditEntityClass: EntityTarget<AuditModel>,
    auditEventTopics: Record<AuditEvent, string>,
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      entityClass,
      auditEntityClass,
      auditEventTopics,
      clsService,
      eventEmitter,
      dataSource,
    );
  }

  async afterInsert(event: InsertEvent<Model>): Promise<any> {
    return this.saveHistory(
      AuditEvent.CREATED,
      event.manager,
      Object.assign(new this.entityClass(), event.entity),
    );
  }

  async afterUpdate(event: UpdateEvent<Model>): Promise<any> {
    return this.saveHistory(
      AuditEvent.UPDATED,
      event.manager,
      Object.assign(new this.entityClass(), event.entity),
    );
  }

  async afterSoftRemove(event: SoftRemoveEvent<Model>): Promise<any> {
    return this.saveHistory(
      AuditEvent.REMOVED,
      event.manager,
      Object.assign(new this.entityClass(), event.entity),
    );
  }

  async afterRemove(event: RemoveEvent<Model>): Promise<any> {
    return this.saveHistory(
      AuditEvent.REMOVED,
      event.manager,
      Object.assign(new this.entityClass(), event.entity),
    );
  }
}
