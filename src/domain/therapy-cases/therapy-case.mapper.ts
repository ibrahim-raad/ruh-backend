import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { TherapyCase } from './entities/therapy-case.entity';
import { UpdateTherapyCase } from './dto/update-therapy-case.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { TherapyCaseOutput } from './dto/therapy-case.output';
import { PatientMapper } from '../patients/patient.mapper';
import { TherapistMapper } from '../therapists/therapist.mapper';

@Injectable()
export class TherapyCaseMapper {
  constructor(
    private readonly patientMapper: PatientMapper,
    private readonly therapistMapper: TherapistMapper,
  ) {}
  public toModel(input: UpdateTherapyCase, existing: TherapyCase): TherapyCase {
    // if (isDefined(input.version) && isDefined(existing?.version)) {
    //   if (!isEqual(input.version, existing?.version)) {
    //     throw new ConflictUpdateError();
    //   }
    // }
    const data = {
      notes: input.notes ?? existing?.notes,
      type: existing?.type,
      status: existing?.status,
      first_session_at: existing?.first_session_at,
      last_session_at: existing?.last_session_at,
      total_sessions: existing?.total_sessions,
      transferred_to: existing?.transferred_to,
      transferred_to_id: existing?.transferred_to_id,
      patient: existing?.patient,
      therapist: existing?.therapist,
    };

    return Object.assign(new TherapyCase(), existing ?? {}, data);
  }

  public toOutput(input: TherapyCase): TherapyCaseOutput {
    return Object.assign(new TherapyCaseOutput(), {
      id: input.id,
      notes: input.notes,
      type: input.type,
      status: input.status,
      first_session_at: input.first_session_at,
      last_session_at: input.last_session_at,
      total_sessions: input.total_sessions,
      transferred_to: input.transferred_to
        ? this.toOutput(input.transferred_to)
        : undefined,
      transferred_to_id: input.transferred_to_id,
      patient: input.patient
        ? this.patientMapper.toOutput(input.patient)
        : undefined,
      patient_id: input.patientId,
      therapist: input.therapist
        ? this.therapistMapper.toOutput(input.therapist)
        : undefined,
      therapist_id: input.therapistId,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
