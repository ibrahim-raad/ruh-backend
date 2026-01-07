import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateReflection } from './dto/create-reflection.dto';
import { Reflection } from './entities/reflection.entity';
import { UpdateReflection } from './dto/update-reflection.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { ReflectionOutput } from './dto/reflection.output';
import { PatientMapper } from '../patients/patient.mapper';

@Injectable()
export class ReflectionMapper {
  constructor(private readonly patientMapper: PatientMapper) {}
  public toModel(input: CreateReflection): Reflection;

  public toModel(input: UpdateReflection, existing: Reflection): Reflection;

  public toModel(
    input: CreateReflection | UpdateReflection,
    existing?: Reflection,
  ): Reflection {
    let data = {};

    if (input instanceof UpdateReflection) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        title: input.title ?? existing?.title,
        content: input.content ?? existing?.content,
        is_private: input.is_private ?? existing?.is_private,
        mood: input.mood ?? existing?.mood,
      };
    } else {
      data = {
        title: input.title,
        content: input.content,
        is_private: input.is_private,
        mood: input.mood,
      };
    }
    return Object.assign(new Reflection(), existing ?? {}, data);
  }

  public toOutput(input: Reflection): ReflectionOutput {
    return Object.assign(new ReflectionOutput(), {
      id: input.id,
      title: input.title,
      content: input.content,
      is_private: input.is_private,
      mood: input.mood,
      patient: input.patient
        ? this.patientMapper.toOutput(input.patient)
        : undefined,
      patient_id: input.patientId,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
