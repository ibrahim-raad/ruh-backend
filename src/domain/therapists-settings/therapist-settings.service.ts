import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapistSettings } from './entities/therapist-settings.entity';
import { SearchTherapistSettings } from './dto/search-therapist-settings.dto';
import { TherapistSettingsAudit } from './entities/therapist-settings.entity.audit';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class TherapistSettingsService extends CrudService<
  TherapistSettings,
  TherapistSettingsAudit
> {
  constructor(
    @InjectRepository(TherapistSettings)
    protected readonly repository: Repository<TherapistSettings>,
    @InjectRepository(TherapistSettingsAudit)
    protected readonly auditRepository: Repository<TherapistSettingsAudit>,
  ) {
    super(TherapistSettings, repository, auditRepository, {
      therapist: {
        user: true,
        currency: true,
        therapistSpecializations: {
          specialization: true,
        },
      },
    });
  }

  public async find(
    criteria: SearchTherapistSettings,
  ): Promise<FindOutputDto<TherapistSettings>> {
    const where = {
      ...(isDefined(criteria.timezone) && {
        timezone: ILike('%' + criteria.timezone + '%'),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
      ...(isDefined(criteria.is_open) && { is_open: criteria.is_open }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
