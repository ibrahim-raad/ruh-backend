import { Controller, Get, Param } from '@nestjs/common';
import { FullQuestionnaireService } from './full-questionnaire.service';
import { QuestionnaireType } from '../questionnaires/shared/questionnaire-type.enum';
import { FullQuestionnaireOutput } from './dto/full-questionnaire.output';
import { FullQuestionnaireMapper } from './full-questionnaire.mapper';

@Controller('/api/v1/questionnaires/full')
export class FullQuestionnaireController {
  constructor(
    private readonly fullQuestionnaireService: FullQuestionnaireService,
    private readonly fullQuestionnaireMapper: FullQuestionnaireMapper,
  ) {}

  @Get(':type')
  async getFullQuestionnaire(
    @Param('type') type: QuestionnaireType,
  ): Promise<FullQuestionnaireOutput> {
    const fullQuestionnaire =
      await this.fullQuestionnaireService.getFullQuestionnaire(type);
    return this.fullQuestionnaireMapper.toOutput(fullQuestionnaire);
  }
}
