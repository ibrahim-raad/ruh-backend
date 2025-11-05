import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { PossibleAnswer } from './entities/possible-answer.entity';
import { PossibleAnswerService } from './possible-answer.service';
import { PossibleAnswerController } from './possible-answer.controller';
import { PossibleAnswerAudit } from './entities/possible-answer.entity.audit';
import { PossibleAnswerSubscriber } from './entities/possible-answer.entity.subscriber';
import { PossibleAnswerMapper } from './possible-answer.mapper';
import { QuestionModule } from '../questions/question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PossibleAnswer, PossibleAnswerAudit]),
    ClsModule,
    EventEmitterModule,
    QuestionModule,
  ],
  providers: [
    PossibleAnswerService,
    PossibleAnswerSubscriber,
    PossibleAnswerMapper,
  ],
  controllers: [PossibleAnswerController],
  exports: [PossibleAnswerService, PossibleAnswerMapper, TypeOrmModule],
})
export class PossibleAnswerModule {}
