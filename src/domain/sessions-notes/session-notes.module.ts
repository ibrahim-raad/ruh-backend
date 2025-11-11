import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { SessionNotes } from './entities/session-notes.entity';
import { SessionNotesService } from './session-notes.service';
import { SessionNotesController } from './session-notes.controller';
import { SessionNotesAudit } from './entities/session-notes.entity.audit';
import { SessionNotesSubscriber } from './entities/session-notes.entity.subscriber';
import { SessionNotesMapper } from './session-notes.mapper';
import { SessionModule } from '../sessions/session.module';
import { SessionNotesListener } from './session-note.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionNotes, SessionNotesAudit]),
    ClsModule,
    EventEmitterModule,
    SessionModule,
  ],
  providers: [
    SessionNotesService,
    SessionNotesSubscriber,
    SessionNotesMapper,
    SessionNotesListener,
  ],
  controllers: [SessionNotesController],
  exports: [SessionNotesService, SessionNotesMapper, TypeOrmModule],
})
export class SessionNotesModule {}
