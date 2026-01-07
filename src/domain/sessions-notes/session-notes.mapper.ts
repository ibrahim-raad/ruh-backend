import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';

import { SessionNotes } from './entities/session-notes.entity';
import { UpdateSessionNotes } from './dto/update-session-notes.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { SessionNotesOutput } from './dto/session-notes.output';
import { SessionMapper } from '../sessions/session.mapper';

@Injectable()
export class SessionNotesMapper {
  constructor(private readonly sessionMapper: SessionMapper) {}
  public toModel(
    input: UpdateSessionNotes,
    existing: SessionNotes,
  ): SessionNotes {
    // @IsNotEmpty()
    // @IsNumber()
    // readonly version: number;
    const data = {
      content: input.content ?? existing?.content,
    };

    return Object.assign(new SessionNotes(), existing ?? {}, data);
  }

  public toOutput(input: SessionNotes): SessionNotesOutput {
    return Object.assign(new SessionNotesOutput(), {
      id: input.id,
      session: input.session
        ? this.sessionMapper.toOutput(input.session)
        : undefined,
      session_id: input.sessionId,
      content: input.content,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
