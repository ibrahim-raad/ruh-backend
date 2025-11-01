import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateSpecialization } from './dto/create-specialization.dto';
import { Specialization } from './entities/specialization.entity';
import { UpdateSpecialization } from './dto/update-specialization.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { SpecializationOutput } from './dto/specialization.output';

@Injectable()
export class SpecializationMapper {
  public toModel(input: CreateSpecialization): Specialization;

  public toModel(
    input: UpdateSpecialization,
    existing: Specialization,
  ): Specialization;

  public toModel(
    input: CreateSpecialization | UpdateSpecialization,
    existing?: Specialization,
  ): Specialization {
    let data = {};

    if (input instanceof UpdateSpecialization) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        name: input.name ?? existing?.name,
        description: input.description ?? existing?.description,
      };
    } else {
      data = {
        name: input.name,
        description: input.description,
      };
    }
    return Object.assign(new Specialization(), existing ?? {}, data);
  }

  public toOutput(input: Specialization): SpecializationOutput {
    return Object.assign(new SpecializationOutput(), {
      id: input.id,
      name: input.name,
      description: input.description,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
