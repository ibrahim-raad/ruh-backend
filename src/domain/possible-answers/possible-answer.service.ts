import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { PossibleAnswer } from './entities/possible-answer.entity';
import { SearchPossibleAnswer } from './dto/search-possible-answer.dto';
import { PossibleAnswerAudit } from './entities/possible-answer.entity.audit';

@Injectable()
export class PossibleAnswerService extends CrudService<
  PossibleAnswer,
  PossibleAnswerAudit
> {
  constructor(
    @InjectRepository(PossibleAnswer)
    protected readonly repository: Repository<PossibleAnswer>,
    @InjectRepository(PossibleAnswerAudit)
    auditRepository: Repository<PossibleAnswerAudit>,
  ) {
    super(PossibleAnswer, repository, auditRepository, {});
  }

  public async find(criteria: SearchPossibleAnswer): Promise<PossibleAnswer[]> {
    const where = {
      ...(isDefined(criteria.answer) && {
        answer: ILike('%' + criteria.answer + '%'),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
      ...(isDefined(criteria.questionnaire_id) && {
        question: {
          questionnaire: { id: criteria.questionnaire_id },
        },
      }),
      ...(isDefined(criteria.question_id) && {
        question: {
          id: criteria.question_id,
          ...(isDefined(criteria.questionnaire_id) && {
            questionnaire: { id: criteria.questionnaire_id },
          }),
        },
      }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
