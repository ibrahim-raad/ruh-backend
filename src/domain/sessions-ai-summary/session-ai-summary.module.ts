import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { SessionAiSummary } from './entities/session-ai-summary.entity';
import { SessionAiSummaryService } from './session-ai-summary.service';
import { SessionAiSummaryController } from './session-ai-summary.controller';
import { SessionAiSummaryAudit } from './entities/session-ai-summary.entity.audit';
import { SessionAiSummarySubscriber } from './entities/session-ai-summary.entity.subscriber';
import { SessionAiSummaryMapper } from './session-ai-summary.mapper';
import { SessionModule } from '../sessions/session.module';
import { SessionAiSummaryListener } from './session-ai-summary.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionAiSummary, SessionAiSummaryAudit]),
    ClsModule,
    EventEmitterModule,
    SessionModule,
  ],
  providers: [
    SessionAiSummaryService,
    SessionAiSummarySubscriber,
    SessionAiSummaryMapper,
    SessionAiSummaryListener,
  ],
  controllers: [SessionAiSummaryController],
  exports: [SessionAiSummaryService, SessionAiSummaryMapper, TypeOrmModule],
})
export class SessionAiSummaryModule {}
