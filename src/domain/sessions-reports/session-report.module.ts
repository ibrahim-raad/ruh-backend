import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { SessionReport } from './entities/session-report.entity';
import { SessionReportService } from './session-report.service';
import { SessionReportController } from './session-report.controller';
import { SessionReportAudit } from './entities/session-report.entity.audit';
import { SessionReportSubscriber } from './entities/session-report.entity.subscriber';
import { SessionReportMapper } from './session-report.mapper';
import { SessionModule } from '../sessions/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionReport, SessionReportAudit]),
    ClsModule,
    EventEmitterModule,
    SessionModule,
  ],
  providers: [
    SessionReportService,
    SessionReportSubscriber,
    SessionReportMapper,
  ],
  controllers: [SessionReportController],
  exports: [SessionReportService, SessionReportMapper, TypeOrmModule],
})
export class SessionReportModule {}
