import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateSessionReport } from './dto/create-session-report.dto';
import { SessionReport } from './entities/session-report.entity';
import { UpdateSessionReport } from './dto/update-session-report.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { SessionReportOutput } from './dto/session-report.output';
import { SessionMapper } from '../sessions/session.mapper';

@Injectable()
export class SessionReportMapper {
  constructor(private readonly sessionMapper: SessionMapper) {}
  public toModel(input: CreateSessionReport): SessionReport;

  public toModel(
    input: UpdateSessionReport,
    existing: SessionReport,
  ): SessionReport;

  public toModel(
    input: CreateSessionReport | UpdateSessionReport,
    existing?: SessionReport,
  ): SessionReport {
    let data = {};

    if (input instanceof UpdateSessionReport) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        overview: input.overview ?? existing?.overview,
        diagnosis: input.diagnosis ?? existing?.diagnosis,
        recommendations: input.recommendations ?? existing?.recommendations,
        next_steps: input.next_steps ?? existing?.next_steps,
        progress_score: input.progress_score ?? existing?.progress_score,
        ai_assisted: input.ai_assisted ?? existing?.ai_assisted,
        is_finalized: input.is_finalized ?? existing?.is_finalized,
        session: existing?.session,
      };
    } else {
      data = {
        overview: input.overview,
        diagnosis: input.diagnosis,
        recommendations: input.recommendations,
        next_steps: input.next_steps,
        progress_score: input.progress_score,
        ai_assisted: input.ai_assisted,
        is_finalized: input.is_finalized,
        session: { id: input.session_id },
      };
    }
    return Object.assign(new SessionReport(), existing ?? {}, data);
  }

  public toOutput(input: SessionReport): SessionReportOutput {
    return Object.assign(new SessionReportOutput(), {
      id: input.id,
      overview: input.overview,
      diagnosis: input.diagnosis,
      recommendations: input.recommendations,
      next_steps: input.next_steps,
      progress_score: input.progress_score,
      ai_assisted: input.ai_assisted,
      is_finalized: input.is_finalized,
      session_id: input.sessionId,
      session: input.session
        ? this.sessionMapper.toOutput(input.session)
        : undefined,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
