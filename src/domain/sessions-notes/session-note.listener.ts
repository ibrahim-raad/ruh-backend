import { Injectable } from '@nestjs/common';
import { SessionNotesService } from './session-notes.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SessionTopic } from '../sessions/shared/session-topic.enum';
import { Session } from '../sessions/entities/session.entity';
import { EntityEvent } from '../shared/entity.event';
import { SessionNotes } from './entities/session-notes.entity';

@Injectable()
export class SessionNotesListener {
  constructor(private readonly sessionNotesService: SessionNotesService) {}

  @OnEvent(SessionTopic.CREATED)
  async handleSessionCreatedEvent(
    payload: EntityEvent<Session>,
  ): Promise<void> {
    const { data } = payload;
    await this.sessionNotesService.create(
      Object.assign(new SessionNotes(), {
        session: { id: data.id },
        content: '',
      }),
    );
  }
}
