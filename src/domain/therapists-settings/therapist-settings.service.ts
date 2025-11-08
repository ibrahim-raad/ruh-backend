import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapistSettings } from './entities/therapist-settings.entity';
import { SearchTherapistSettings } from './dto/search-therapist-settings.dto';
import { TherapistSettingsAudit } from './entities/therapist-settings.entity.audit';

@Injectable()
export class TherapistSettingsService extends CrudService<
  TherapistSettings,
  TherapistSettingsAudit
> {
  constructor(
    @InjectRepository(TherapistSettings)
    protected readonly repository: Repository<TherapistSettings>,
    @InjectRepository(TherapistSettingsAudit)
    auditRepository: Repository<TherapistSettingsAudit>,
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
  ): Promise<TherapistSettings[]> {
    const where = {
      ...(isDefined(criteria.timezone) && {
        timezone: ILike('%' + criteria.timezone + '%'),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
      ...(isDefined(criteria.is_open) && { is_open: criteria.is_open }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
