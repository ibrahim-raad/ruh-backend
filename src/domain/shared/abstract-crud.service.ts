import { ClassConstructor, plainToInstance } from 'class-transformer';
import { isArray, validateOrReject } from 'class-validator';
import {
  DeepPartial,
  EntityNotFoundError,
  FindOptionsOrder,
  Repository,
} from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { convertToNestedObject, diff } from '../../utils';
import { AbstractEntity } from './abstract.entity';
import { Pageable } from './pageable.interface';
import * as fs from 'fs';
import { AuditEntity } from './audit.entity';
import { AuditService } from './audit.service';
import { PickKeysByType } from 'typeorm/common/PickKeysByType';
import { ValidationError } from '@nestjs/common';
import { ServiceValidationError } from 'src/errors/service-validation.error';

export abstract class CrudService<
  Model extends AbstractEntity,
  AuditModel extends AuditEntity<Model>,
> extends AuditService<Model, AuditModel> {
  protected constructor(
    protected readonly cls: ClassConstructor<Model>,
    protected readonly repository: Repository<Model>,
    protected readonly auditRepository: Repository<AuditModel>,
    protected readonly relations: FindOptionsRelations<Model> = {},
  ) {
    super(cls, repository, auditRepository, relations);
  }

  public async create(input: Model): Promise<Model> {
    await this.validateInput(input);
    const entity = this.repository.create(input);
    const savedEntity = await this.repository.save(entity);
    return savedEntity;
  }

  public async update(old: Model, input: Model): Promise<Model> {
    const changes = diff(old, input);
    if (changes) {
      await this.validateInput(changes);
      const updatedEntity = await this.repository.save(changes);
      return updatedEntity;
    }
    return old;
  }

  public async one(
    criteria: FindOptionsWhere<Model>,
    relations: FindOptionsRelations<Model>,
    failOnNotFound: false,
  ): Promise<Model | null>;

  public async one(
    criteria: FindOptionsWhere<Model>,
    relations?: FindOptionsRelations<Model>,
    failOnNotFound?: true,
  ): Promise<Model>;

  public async one(
    criteria: FindOptionsWhere<Model>,
    relations: FindOptionsRelations<Model> = {},
    failOnNotFound = true,
  ): Promise<Model | null> {
    const entity = await this.repository.findOne({
      where: criteria,
      relations: { ...this.relations, ...relations },
    });

    if (failOnNotFound && !entity) {
      throw new EntityNotFoundError(this.cls, criteria);
    }

    return entity;
  }

  public async remove(
    criteria: DeepPartial<Model>,
  ): Promise<{ message: string }> {
    await this.repository.softRemove(criteria, { reload: true });
    return { message: 'Deleted successfully' };
  }

  public async count(
    criteria: FindOptionsWhere<Model>,
    relations: FindOptionsRelations<Model> = {},
  ): Promise<number> {
    return this.repository.count({ where: criteria, relations });
  }

  public async sum(
    field: PickKeysByType<Model, number>,
    criteria: FindOptionsWhere<Model>,
  ): Promise<number> {
    return (await this.repository.sum(field, criteria)) ?? 0;
  }
  public async average(
    field: PickKeysByType<Model, number>,
    criteria: FindOptionsWhere<Model>,
  ): Promise<number> {
    return (await this.repository.average(field, criteria)) ?? 0;
  }

  public removeFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  public async permanentDelete(
    criteria: FindOptionsWhere<Model>,
  ): Promise<{ message: string }> {
    await this.repository.delete(criteria);
    return { message: 'Deleted successfully' };
  }

  public async restore(criteria: FindOptionsWhere<Model>): Promise<Model> {
    const entity = await this.repository.findOne({
      where: criteria,
      withDeleted: true,
    });

    if (!entity) {
      throw new EntityNotFoundError(this.cls, criteria);
    }

    entity.deleted_at = undefined;
    const restoredEntity = await this.repository.save(entity);
    return restoredEntity;
  }

  public async all(
    where: FindOptionsWhere<Model>,
    page: Pageable,
    withDeleted = false,
    relations: FindOptionsRelations<Model> = {},
  ): Promise<Model[]> {
    const entities = await this.repository.find({
      skip: page.offset,
      take: page.limit,
      order: convertToNestedObject(page.sort, {
        value: ' ',
      }) as FindOptionsOrder<Model>,
      where,
      relations: { ...this.relations, ...relations },
      withDeleted,
    });
    return entities;
  }

  protected async validateInput(input: Model): Promise<void> {
    const entity = plainToInstance(this.cls, input);
    try {
      await validateOrReject(entity);
    } catch (errors: any) {
      let reasons = '';
      if (isArray(errors)) {
        reasons = errors
          .map((err) => {
            if ((err as ValidationError).constraints) {
              return Object.values(
                (err as ValidationError).constraints ?? {},
              ).join(', ');
            }
            return '';
          })
          .filter(Boolean)
          .join('; ');
      } else {
        reasons = (errors as Error)?.message ?? '';
      }
      throw new ServiceValidationError(reasons);
    }
  }
}
