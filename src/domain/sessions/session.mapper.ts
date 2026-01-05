import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateSession } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { UpdateSession } from './dto/update-session.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { SessionOutput } from './dto/session.output';
import { TherapyCaseMapper } from '../therapy-cases/therapy-case.mapper';
import { SessionStatus } from './shared/session-status.enum';
import { TherapyCase } from '../therapy-cases/entities/therapy-case.entity';

@Injectable()
export class SessionMapper {
  constructor(private readonly therapyCaseMapper: TherapyCaseMapper) {}
  public toModel(input: CreateSession): Session;

  public toModel(input: UpdateSession, existing: Session): Session;

  public toModel(
    input: CreateSession | UpdateSession,
    existing?: Session,
  ): Session {
    let data: Partial<Session> = {};

    if (input instanceof UpdateSession) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        patient_feedback: input.patient_feedback ?? existing?.patient_feedback,
      };
    } else {
      const startTime: Date = new Date(input.start);
      data = {
        therapy_case: { id: input.therapy_case_id } as TherapyCase,
        start_time: startTime,
        // TODO: change to PENDING when we have a way to confirm sessions
        // TODO: add a way to confirm sessions
        status: SessionStatus.CONFIRMED,
      };
    }
    return Object.assign(new Session(), existing ?? {}, data);
  }

  public toOutput(input: Session): SessionOutput {
    return Object.assign(new SessionOutput(), {
      id: input.id,
      therapy_case_id: input.therapy_caseId,
      therapy_case: input.therapy_case
        ? this.therapyCaseMapper.toOutput(input.therapy_case)
        : undefined,
      status: input.status,
      start_time: input.start_time,
      end_time: input.end_time,
      actual_start_time: input.actual_start_time,
      actual_end_time: input.actual_end_time,
      link: input.link,
      audio_link: input.audio_link,
      patient_feedback: input.patient_feedback,
      type: input.type,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
