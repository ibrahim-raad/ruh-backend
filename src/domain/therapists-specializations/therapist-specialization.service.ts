import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapistSpecialization } from './entities/therapist-specialization.entity';
import { SearchTherapistSpecialization } from './dto/search-therapist-specialization.dto';
import { TherapistSpecializationAudit } from './entities/therapist-specialization.entity.audit';
import { TherapistService } from '../therapists/therapist.service';
import { SpecializationService } from '../specializations/specialization.service';
import { ClsService } from 'nestjs-cls';
import { SESSION_USER_KEY } from 'src/app.constants';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TherapistSpecializationService extends CrudService<
  TherapistSpecialization,
  TherapistSpecializationAudit
> {
  constructor(
    @InjectRepository(TherapistSpecialization)
    protected readonly repository: Repository<TherapistSpecialization>,
    @InjectRepository(TherapistSpecializationAudit)
    protected readonly auditRepository: Repository<TherapistSpecializationAudit>,
    private readonly therapistService: TherapistService,
    private readonly specializationService: SpecializationService,
    private readonly clsService: ClsService,
  ) {
    super(TherapistSpecialization, repository, auditRepository, {
      therapist: {
        user: true,
      },
      specialization: true,
    });
  }

  public async create(
    input: TherapistSpecialization,
  ): Promise<TherapistSpecialization> {
    const currentUser = this.clsService.get<{ user: User | undefined }>(
      SESSION_USER_KEY,
    )?.user;
    const therapist = await this.therapistService.one({
      user: { id: currentUser?.id },
    });
    const existing = await this.one(
      {
        therapist: { id: therapist.id },
        specialization: { id: input.specialization.id },
      },
      {},
      false,
      true,
    );
    if (existing) {
      if (existing.deleted_at) {
        const restored = await this.restore({ id: existing.id });
        return restored;
      }
      throw new ConflictException('Therapist specialization already exists');
    }
    const specialization = await this.specializationService.one({
      id: input.specialization.id,
    });
    return super.create({
      ...input,
      therapist,
      specialization,
    });
  }

  public async find(
    criteria: SearchTherapistSpecialization,
  ): Promise<TherapistSpecialization[]> {
    const where = {
      ...(isDefined(criteria.therapist_ids) && {
        therapist: { id: In(criteria.therapist_ids) },
      }),
      ...(isDefined(criteria.specialization_ids) && {
        specialization: { id: In(criteria.specialization_ids) },
      }),
      ...(isDefined(criteria.specialization_name) && {
        specialization: {
          name: ILike('%' + criteria.specialization_name + '%'),
        },
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
