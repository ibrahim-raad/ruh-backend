import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Question } from './entities/question.entity';
import { SearchQuestion } from './dto/search-question.dto';
import { QuestionAudit } from './entities/question.entity.audit';
import { QuestionnaireService } from '../questionnaires/questionnaire.service';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class QuestionService extends CrudService<Question, QuestionAudit> {
  constructor(
    @InjectRepository(Question)
    protected readonly repository: Repository<Question>,
    @InjectRepository(QuestionAudit)
    protected readonly auditRepository: Repository<QuestionAudit>,
    private readonly questionnaireService: QuestionnaireService,
  ) {
    super(Question, repository, auditRepository, {});
  }

  public async create(input: Question): Promise<Question> {
    const questionnaire = await this.questionnaireService.one({
      id: input.questionnaire.id,
    });
    const orders = await this.getOrdersForQuestionnaire(input.questionnaire.id);

    // database sorted orders
    const max = parseFloat(orders.pop()?.toString() ?? '-1');
    const order = max + 1;
    return super.create({ ...input, questionnaire, order });
  }

  public async update(old: Question, input: Question): Promise<Question> {
    let questionnaire = old.questionnaire;
    if (input.questionnaire.id !== old.questionnaire.id) {
      questionnaire = await this.questionnaireService.one({
        id: input.questionnaire.id,
      });
    }

    return super.update(old, { ...input, questionnaire });
  }
  private async getOrdersForQuestionnaire(
    questionnaire_id: string,
  ): Promise<number[]> {
    const { items: questions } = await this.all(
      {
        questionnaire: { id: questionnaire_id },
      },
      {
        offset: 0,
        limit: 0,
        sort: 'order ASC',
      },
      false,
      {
        questionnaire: true,
      },
    );
    return questions.map((question) => question.order);
  }

  public async find(
    criteria: SearchQuestion,
  ): Promise<FindOutputDto<Question>> {
    const where = {
      ...(isDefined(criteria.question) && {
        question: ILike('%' + criteria.question + '%'),
      }),
      ...(isDefined(criteria.types) && { type: In(criteria.types) }),
      ...(isDefined(criteria.questionnaire_id) && {
        questionnaire: { id: criteria.questionnaire_id },
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
