import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { TherapistSettings } from './entities/therapist-settings.entity';
import { UpdateTherapistSettings } from './dto/update-therapist-settings.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { TherapistSettingsOutput } from './dto/therapist-settings.output';
import { TherapistMapper } from '../therapists/therapist.mapper';

@Injectable()
export class TherapistSettingsMapper {
  constructor(private readonly therapistMapper: TherapistMapper) {}
  public toModel(
    input: UpdateTherapistSettings,
    existing: TherapistSettings,
  ): TherapistSettings {
    // @IsNotEmpty()
    // @IsNumber()
    // readonly version: number;
    const data = {
      timezone: input.timezone ?? existing?.timezone,
      is_open: input.is_open ?? existing?.is_open,
      booking_threshold_hours:
        input.booking_threshold_hours ?? existing?.booking_threshold_hours,
      max_booking_days: input.max_booking_days ?? existing?.max_booking_days,
      max_sessions_per_day:
        input.max_sessions_per_day ?? existing?.max_sessions_per_day,
      session_duration_minutes:
        input.session_duration_minutes ?? existing?.session_duration_minutes,
      buffer_minutes: input.buffer_minutes ?? existing?.buffer_minutes,
    };

    return Object.assign(new TherapistSettings(), existing ?? {}, data);
  }

  public toOutput(input: TherapistSettings): TherapistSettingsOutput {
    return Object.assign(new TherapistSettingsOutput(), {
      id: input.id,
      therapist_id: input.therapistId,
      therapist: input.therapist
        ? this.therapistMapper.toOutput(input.therapist)
        : undefined,
      is_open: input.is_open,
      booking_threshold_hours: parseFloat(
        input.booking_threshold_hours.toString(),
      ),
      max_booking_days: parseFloat(input.max_booking_days.toString()),
      max_sessions_per_day: parseFloat(input.max_sessions_per_day.toString()),
      session_duration_minutes: parseFloat(
        input.session_duration_minutes.toString(),
      ),
      buffer_minutes: parseFloat(input.buffer_minutes.toString()),
      timezone: input.timezone,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
