import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateTherapistSpecialization } from './dto/create-therapist-specialization.dto';
import { TherapistSpecialization } from './entities/therapist-specialization.entity';
import { UpdateTherapistSpecialization } from './dto/update-therapist-specialization.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { TherapistSpecializationOutput } from './dto/therapist-specialization.output';
import { TherapistMapper } from '../therapists/therapist.mapper';
import { SpecializationMapper } from '../specializations/specialization.mapper';

@Injectable()
export class TherapistSpecializationMapper {
  constructor(
    private readonly therapistMapper: TherapistMapper,
    private readonly specializationMapper: SpecializationMapper,
  ) {}
  public toModel(input: CreateTherapistSpecialization): TherapistSpecialization;

  public toModel(
    input: UpdateTherapistSpecialization,
    existing: TherapistSpecialization,
  ): TherapistSpecialization;

  public toModel(
    input: CreateTherapistSpecialization | UpdateTherapistSpecialization,
    existing?: TherapistSpecialization,
  ): TherapistSpecialization {
    let data = {};

    if (input instanceof UpdateTherapistSpecialization) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        specialization: { id: input.specialization_id },
        therapist: existing?.therapist,
      };
    } else {
      data = {
        specialization: { id: input.specialization_id },
      };
    }
    return Object.assign(new TherapistSpecialization(), existing ?? {}, data);
  }

  public toOutput(
    input: TherapistSpecialization,
  ): TherapistSpecializationOutput {
    return Object.assign(new TherapistSpecializationOutput(), {
      id: input.id,
      therapist_id: input.therapistId,
      specialization_id: input.specializationId,
      therapist: this.therapistMapper.toOutput(input.therapist),
      specialization: this.specializationMapper.toOutput(input.specialization),
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
