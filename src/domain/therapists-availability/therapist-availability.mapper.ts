import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { TherapistAvailability } from './entities/therapist-availability.entity';
import { UpdateTherapistAvailability } from './dto/update-therapist-availability.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { TherapistAvailabilityOutput } from './dto/therapist-availability.output';
import { TherapistMapper } from '../therapists/therapist.mapper';

@Injectable()
export class TherapistAvailabilityMapper {
  constructor(private readonly therapistMapper: TherapistMapper) {}

  public toModel(
    input: UpdateTherapistAvailability,
    existing?: TherapistAvailability,
  ): TherapistAvailability {
    let data = {};

    if (isDefined(input.version) && isDefined(existing?.version)) {
      if (!isEqual(input.version, existing?.version)) {
        throw new ConflictUpdateError();
      }
    }
    data = {
      day_of_week: input.day_of_week ?? existing?.day_of_week,
      start_time: input.start_time ?? existing?.start_time,
      end_time: input.end_time ?? existing?.end_time,
      break_start_time: input.break_start_time ?? existing?.break_start_time,
      break_end_time: input.break_end_time ?? existing?.break_end_time,
      is_active: input.is_active ?? existing?.is_active,
    };
    return Object.assign(new TherapistAvailability(), existing ?? {}, data);
  }

  public toOutput(input: TherapistAvailability): TherapistAvailabilityOutput {
    return Object.assign(new TherapistAvailabilityOutput(), {
      id: input.id,
      day_of_week: input.day_of_week,
      start_time: input.start_time,
      end_time: input.end_time,
      break_start_time: input.break_start_time,
      break_end_time: input.break_end_time,
      therapist_id: input.therapistId,
      therapist: input.therapist
        ? this.therapistMapper.toOutput(input.therapist)
        : undefined,
      is_active: input.is_active,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
