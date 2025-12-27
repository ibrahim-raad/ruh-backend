import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { Patient } from './entities/patient.entity';
import { UpdatePatient } from './dto/update-patient.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { PatientOutput } from './dto/patient.output';
import { UserMapper } from '../users/user.mapper';

@Injectable()
export class PatientMapper {
  constructor(private readonly userMapper: UserMapper) {}
  public toModel(input: UpdatePatient, existing: Patient): Patient {
    let data = {};

    if (isDefined(input.patient_version) && isDefined(existing.version)) {
      if (!isEqual(input.patient_version, existing.version)) {
        throw new ConflictUpdateError();
      }
    }
    data = {
      user: this.userMapper.toModel(input, existing.user),
      preferred_therapist_gender:
        input.preferred_therapist_gender ?? existing.preferred_therapist_gender,
      preferred_therapy_mode:
        input.preferred_therapy_mode ?? existing.preferred_therapy_mode,
      provider_customer_id:
        input.provider_customer_id ?? existing.provider_customer_id,
    };
    return Object.assign(new Patient(), existing, data);
  }

  public toOutput(input: Patient): PatientOutput {
    console.log('patient.toOutput', input);

    return Object.assign(new PatientOutput(), {
      id: input.id,
      user: input.user ? this.userMapper.toOutput(input.user) : undefined,
      user_id: input.userId,
      preferred_therapist_gender: input.preferred_therapist_gender,
      preferred_therapy_mode: input.preferred_therapy_mode,
      provider_customer_id: input.provider_customer_id,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
