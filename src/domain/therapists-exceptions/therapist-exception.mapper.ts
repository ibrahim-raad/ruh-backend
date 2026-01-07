import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateTherapistException } from './dto/create-therapist-exception.dto';
import { TherapistException } from './entities/therapist-exception.entity';
import { UpdateTherapistException } from './dto/update-therapist-exception.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { TherapistExceptionOutput } from './dto/therapist-exception.output';
import { TherapistMapper } from '../therapists/therapist.mapper';

@Injectable()
export class TherapistExceptionMapper {
  constructor(private readonly therapistMapper: TherapistMapper) {}
  public toModel(input: CreateTherapistException): TherapistException;

  public toModel(
    input: UpdateTherapistException,
    existing: TherapistException,
  ): TherapistException;

  public toModel(
    input: CreateTherapistException | UpdateTherapistException,
    existing?: TherapistException,
  ): TherapistException {
    let data = {};

    if (input instanceof UpdateTherapistException) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        date: input.date ?? existing?.date,
        is_available: input.is_available ?? existing?.is_available,
        start_time: input.start_time ?? existing?.start_time,
        end_time: input.end_time ?? existing?.end_time,
        reason: input.reason ?? existing?.reason,
        therapist: existing?.therapist,
      };
    } else {
      data = {
        date: input.date,
        is_available: input.is_available,
        start_time: input.start_time,
        end_time: input.end_time,
        reason: input.reason,
      };
    }
    return Object.assign(new TherapistException(), existing ?? {}, data);
  }

  public toOutput(input: TherapistException): TherapistExceptionOutput {
    return Object.assign(new TherapistExceptionOutput(), {
      id: input.id,
      date: input.date,
      is_available: input.is_available,
      start_time: input.start_time,
      end_time: input.end_time,
      reason: input.reason,
      therapist_id: input.therapistId,
      therapist: input.therapist
        ? this.therapistMapper.toOutput(input.therapist)
        : undefined,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
