import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';

import { SessionAiSummary } from './entities/session-ai-summary.entity';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { SessionAiSummaryOutput } from './dto/session-ai-summary.output';
import { SessionMapper } from '../sessions/session.mapper';

@Injectable()
export class SessionAiSummaryMapper {
  constructor(private readonly sessionMapper: SessionMapper) {}

  public toOutput(input: SessionAiSummary): SessionAiSummaryOutput {
    return Object.assign(new SessionAiSummaryOutput(), {
      id: input.id,
      session: input.session
        ? this.sessionMapper.toOutput(input.session)
        : undefined,
      session_id: input.sessionId,
      summary: input.summary,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
