import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Patient } from './entities/patient.entity';
import { SearchPatient } from './dto/search-patient.dto';
import { PatientAudit } from './entities/patient.entity.audit';
import { UserService } from '../users/user.service';

@Injectable()
export class PatientService extends CrudService<Patient, PatientAudit> {
  constructor(
    @InjectRepository(Patient)
    protected readonly repository: Repository<Patient>,
    @InjectRepository(PatientAudit)
    auditRepository: Repository<PatientAudit>,
    private readonly userService: UserService,
  ) {
    super(Patient, repository, auditRepository, {
      user: {
        country: true,
      },
    });
  }

  public async update(old: Patient, input: Patient): Promise<Patient> {
    await this.userService.update(old.user, input.user);
    return super.update(old, input);
  }

  public async find(criteria: SearchPatient): Promise<Patient[]> {
    const userWhere = this.userService.generateWhere(criteria);
    const isEmpty = Object.keys(userWhere).length > 0;
    const where = {
      ...(!isEmpty && {
        user: {
          ...userWhere,
        },
      }),
      ...(isDefined(criteria.preferred_therapist_gender) && {
        preferred_therapist_gender: criteria.preferred_therapist_gender,
      }),
      ...(isDefined(criteria.preferred_therapy_modes) && {
        preferred_therapy_mode: In(criteria.preferred_therapy_modes),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
