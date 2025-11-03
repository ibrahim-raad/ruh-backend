import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionAudit } from './entities/question.entity.audit';
import { QuestionSubscriber } from './entities/question.entity.subscriber';
import { QuestionMapper } from './question.mapper';
import { QuestionnaireModule } from '../questionnaires/questionnaire.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionAudit]),
    ClsModule,
    EventEmitterModule,
    QuestionnaireModule,
  ],
  providers: [QuestionService, QuestionSubscriber, QuestionMapper],
  controllers: [QuestionController],
  exports: [QuestionService, QuestionMapper, TypeOrmModule],
})
export class QuestionModule {}
