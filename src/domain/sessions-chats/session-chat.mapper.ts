import { Injectable } from '@nestjs/common';

import { CreateSessionChat } from './dto/create-session-chat.dto';
import { SessionChat } from './entities/session-chat.entity';
import { SessionChatOutput } from './dto/session-chat.output';
import { SessionMapper } from '../sessions/session.mapper';
import { UserMapper } from '../users/user.mapper';

@Injectable()
export class SessionChatMapper {
  constructor(
    private readonly sessionMapper: SessionMapper,
    private readonly userMapper: UserMapper,
  ) {}
  public toModel(input: CreateSessionChat, session_id: string): SessionChat {
    const data = {
      message: input.message,
      session: { id: session_id },
    };

    return Object.assign(new SessionChat(), data);
  }

  public toOutput(input: SessionChat): SessionChatOutput {
    return Object.assign(new SessionChatOutput(), {
      id: input.id,
      message: input.message,
      session_id: input.sessionId,
      user_id: input.userId,
      user: input.user ? this.userMapper.toOutput(input.user) : undefined,
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
