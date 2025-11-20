import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapistAvailability } from './entities/therapist-availability.entity';
import { SearchTherapistAvailability } from './dto/search-therapist-availability.dto';
import { TherapistAvailabilityAudit } from './entities/therapist-availability.entity.audit';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class TherapistAvailabilityService extends CrudService<
  TherapistAvailability,
  TherapistAvailabilityAudit
> {
  constructor(
    @InjectRepository(TherapistAvailability)
    protected readonly repository: Repository<TherapistAvailability>,
    @InjectRepository(TherapistAvailabilityAudit)
    protected readonly auditRepository: Repository<TherapistAvailabilityAudit>,
  ) {
    super(TherapistAvailability, repository, auditRepository, {
      therapist: {
        user: true,
      },
    });
  }

  public async find(
    criteria: SearchTherapistAvailability,
  ): Promise<FindOutputDto<TherapistAvailability>> {
    const where = {
      ...(isDefined(criteria.days_of_week) && {
        day_of_week: In(criteria.days_of_week),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
