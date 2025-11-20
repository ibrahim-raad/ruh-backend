import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Therapist } from './entities/therapist.entity';
import { SearchTherapist } from './dto/search-therapist.dto';
import { TherapistAudit } from './entities/therapist.entity.audit';
import { UserService } from '../users/user.service';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class TherapistService extends CrudService<Therapist, TherapistAudit> {
  constructor(
    @InjectRepository(Therapist)
    protected readonly repository: Repository<Therapist>,
    @InjectRepository(TherapistAudit)
    protected readonly auditRepository: Repository<TherapistAudit>,
    private readonly userService: UserService,
  ) {
    super(Therapist, repository, auditRepository, {
      user: {
        country: true,
      },
      currency: true,
      therapistSpecializations: {
        specialization: true,
      },
    });
  }

  public async update(old: Therapist, input: Therapist): Promise<Therapist> {
    await this.userService.update(old.user, input.user);
    return super.update(old, input);
  }

  public async find(
    criteria: SearchTherapist,
  ): Promise<FindOutputDto<Therapist>> {
    const where = {
      ...(isDefined(criteria.name) && {
        name: ILike('%' + criteria.name + '%'),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
