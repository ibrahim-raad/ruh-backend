import { AuditEvent } from './audit-event.enum';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import {
  DataSource,
  DeepPartial,
  EntitySubscriberInterface,
  EntityTarget,
} from 'typeorm';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AbstractEntity } from './abstract.entity';
import { AuditEntity } from './audit.entity';
import { EntityEvent } from './entity.event';
import { Logger } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

export abstract class AbstractSubscriber<
  Model extends AbstractEntity,
  AuditModel extends AuditEntity<Model>,
> implements EntitySubscriberInterface<Model>
{
  private readonly logger = new Logger(AbstractSubscriber.name);

  protected constructor(
    protected readonly entityClass: ClassConstructor<Model>,
    protected readonly auditEntityClass: EntityTarget<AuditModel>,
    protected readonly auditEventTopic: Record<AuditEvent, string>,
    protected readonly clsService: ClsService,
    protected readonly eventEmitter: EventEmitter2,
    protected readonly dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return this.entityClass;
  }

  protected sessionUser(): User | undefined {
    const context = this.clsService.get<{ user: User | undefined }>(
      'user-context',
    );

    if (!context) {
      this.logger.debug('No CLS context found');
      return undefined;
    }

    if (!context.user) {
      this.logger.debug('User not found in CLS context');
      this.logger.debug(
        `Available context keys: ${Object.keys(context).join(', ')}`,
      );
      return undefined;
    }

    return context.user;
  }

  protected async saveHistory(
    event: AuditEvent,
    manager: EntityManager,
    entity: Model,
    emitEvent: boolean = true,
  ): Promise<any> {
    const user = this.sessionUser();
    const repository = manager.getRepository(this.auditEntityClass);
    if (!entity) return;

    const result = await repository.save({
      id: entity.id,
      version: entity.version,
      event,
      userId: user ? `${user.id}` : undefined,
      data: entity,
    } as DeepPartial<AuditModel>);

    // This should not have await, this transaction should not wait for the event to be dispatched and
    if (emitEvent) {
      void this.eventEmitter.emitAsync(
        this.auditEventTopic[event],
        new EntityEvent<Model>(entity, user),
      );
    }

    return result;
  }
}
