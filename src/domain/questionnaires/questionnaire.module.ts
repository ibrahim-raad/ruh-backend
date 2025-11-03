import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Questionnaire } from './entities/questionnaire.entity';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireController } from './questionnaire.controller';
import { QuestionnaireAudit } from './entities/questionnaire.entity.audit';
import { QuestionnaireSubscriber } from './entities/questionnaire.entity.subscriber';
import { QuestionnaireMapper } from './questionnaire.mapper';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Questionnaire, QuestionnaireAudit]),
    ClsModule,
    EventEmitterModule,
    UserModule,
  ],
  providers: [
    QuestionnaireService,
    QuestionnaireSubscriber,
    QuestionnaireMapper,
  ],
  controllers: [QuestionnaireController],
  exports: [QuestionnaireService, QuestionnaireMapper, TypeOrmModule],
})
export class QuestionnaireModule {}
