import { ClassConstructor } from 'class-transformer/types/interfaces';
import { isDefined } from 'class-validator';
import { FindOptionsOrder, In, Repository } from 'typeorm';
import { convertToNestedObject } from '../../utils';

import { AuditCriteria } from './audit.criteria';
import { AuditEntity } from './audit.entity';
import { AuditEvent } from './audit-event.enum';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { AbstractEntity } from './abstract.entity';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { AbstractService } from './abstract.service';
import { InRange } from './find-operator.extensions';
import { FindOutputDto } from './dto/find-output,dto';

export abstract class AuditService<
  Model extends AbstractEntity,
  AuditModel extends AuditEntity<Model>,
> extends AbstractService<Model> {
  protected constructor(
    protected readonly cls: ClassConstructor<Model>,
    protected readonly repository: Repository<Model>,
    protected readonly auditRepository: Repository<AuditModel>,
    protected readonly relations: FindOptionsRelations<Model>,
  ) {
    super(cls);
  }

  public async history(
    criteria: AuditCriteria & { exist: FindOptionsWhere<Model> },
  ): Promise<FindOutputDto<AuditModel>> {
    const where = {
      ...(isDefined(criteria.version) && { version: criteria.version }),
      ...(isDefined(criteria.events) &&
        criteria.events.length > 0 && {
          event: In<AuditEvent>(criteria.events),
        }),
      createdAt: InRange(criteria.date),
    } as FindOptionsWhere<AuditModel>;

    const entity = await this.repository.findOne({
      where: criteria.exist,
      relations: this.relations,
    });

    if (!isDefined(entity)) {
      return { items: [], total: 0 };
    }

    const [items, total] = await this.auditRepository.findAndCount({
      skip: criteria.offset,
      take: criteria.limit,
      order: convertToNestedObject(criteria.sort, {
        value: ' ',
      }) as FindOptionsOrder<AuditModel>,
      where: {
        id: entity.id,
        ...where,
      },
    });
    return { items, total };
  }

  public async historyAll(
    criteria: AuditCriteria,
  ): Promise<FindOutputDto<AuditModel>> {
    const where = {
      ...(isDefined(criteria.version) && { version: criteria.version }),
      ...(isDefined(criteria.events) &&
        criteria.events.length > 0 && {
          event: In<AuditEvent>(criteria.events),
        }),
      createdAt: InRange(criteria.date),
    } as FindOptionsWhere<AuditModel>;

    const [items, total] = await this.auditRepository.findAndCount({
      skip: criteria.offset,
      take: criteria.limit,
      order: convertToNestedObject(criteria.sort, {
        value: ' ',
      }) as FindOptionsOrder<AuditModel>,
      where,
    });
    return { items, total };
  }
}
