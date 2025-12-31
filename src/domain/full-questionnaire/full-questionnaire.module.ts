import { Module } from '@nestjs/common';
import { QuestionnaireModule } from '../questionnaires/questionnaire.module';
import { QuestionModule } from '../questions/question.module';
import { PossibleAnswerModule } from '../possible-answers/possible-answer.module';
import { FullQuestionnaireMapper } from './full-questionnaire.mapper';
import { FullQuestionnaireService } from './full-questionnaire.service';
import { FullQuestionnaireController } from './full-questionnaire.controller';

@Module({
  imports: [QuestionnaireModule, QuestionModule, PossibleAnswerModule],
  providers: [FullQuestionnaireService, FullQuestionnaireMapper],
  controllers: [FullQuestionnaireController],
  exports: [FullQuestionnaireService, FullQuestionnaireMapper],
})
export class FullQuestionnaireModule {}
