import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Specialization } from './entities/specialization.entity';
import { SearchSpecialization } from './dto/search-specialization.dto';
import { SpecializationAudit } from './entities/specialization.entity.audit';

@Injectable()
export class SpecializationService extends CrudService<
  Specialization,
  SpecializationAudit
> {
  constructor(
    @InjectRepository(Specialization)
    protected readonly repository: Repository<Specialization>,
    @InjectRepository(SpecializationAudit)
    auditRepository: Repository<SpecializationAudit>,
  ) {
    super(Specialization, repository, auditRepository, {});
  }

  public async find(criteria: SearchSpecialization): Promise<Specialization[]> {
    const where = {
      ...(isDefined(criteria.name) && {
        name: ILike('%' + criteria.name + '%'),
      }),
      ...(isDefined(criteria.description) && {
        description: ILike('%' + criteria.description + '%'),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
