import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapyCase } from './entities/therapy-case.entity';
import { SearchTherapyCase } from './dto/search-therapy-case.dto';
import { TherapyCaseAudit } from './entities/therapy-case.entity.audit';
import { PatientService } from '../patients/patient.service';
import { TherapistService } from '../therapists/therapist.service';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class TherapyCaseService extends CrudService<
  TherapyCase,
  TherapyCaseAudit
> {
  constructor(
    @InjectRepository(TherapyCase)
    protected readonly repository: Repository<TherapyCase>,
    @InjectRepository(TherapyCaseAudit)
    protected readonly auditRepository: Repository<TherapyCaseAudit>,
    private readonly patientService: PatientService,
    private readonly therapistService: TherapistService,
  ) {
    super(TherapyCase, repository, auditRepository, {
      patient: {
        user: true,
      },
      therapist: {
        user: true,
      },
      transferred_to: {
        patient: {
          user: true,
        },
        therapist: {
          user: true,
        },
      },
    });
  }

  public async create(input: TherapyCase): Promise<TherapyCase> {
    const patient = await this.patientService.one({ id: input.patient.id });
    const therapist = await this.therapistService.one({
      id: input.therapist.id,
    });
    const entity = Object.assign(new TherapyCase(), input, {
      patient,
      therapist,
    });
    return super.create(entity);
  }

  public async update(
    old: TherapyCase,
    input: TherapyCase,
  ): Promise<TherapyCase> {
    if (isDefined(old.transferred_to_id)) return super.update(old, input);
    const transferred_to = isDefined(input.transferred_to?.id)
      ? await this.one({ id: input.transferred_to?.id })
      : undefined;
    const entity = Object.assign(new TherapyCase(), input, {
      transferred_to,
    });
    return super.update(old, entity);
  }

  public async find(
    criteria: SearchTherapyCase,
  ): Promise<FindOutputDto<TherapyCase>> {
    const where = {
      ...(isDefined(criteria.patient_name) && {
        patient: {
          user: { full_name: ILike('%' + criteria.patient_name + '%') },
        },
      }),
      ...(isDefined(criteria.patient_id) && {
        patient: { id: criteria.patient_id },
      }),
      ...(isDefined(criteria.therapist_id) && {
        therapist: { id: criteria.therapist_id },
      }),
      ...(isDefined(criteria.transferred_to_id) && {
        transferred_to: { id: criteria.transferred_to_id },
      }),
      ...(isDefined(criteria.type) && {
        type: criteria.type,
      }),
      ...(isDefined(criteria.status) && {
        status: criteria.status,
      }),
      ...(isDefined(criteria.notes) && {
        notes: ILike('%' + criteria.notes + '%'),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
