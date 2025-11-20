import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  ILike,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Questionnaire } from './entities/questionnaire.entity';
import { SearchQuestionnaire } from './dto/search-questionnaire.dto';
import { QuestionnaireAudit } from './entities/questionnaire.entity.audit';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class QuestionnaireService extends CrudService<
  Questionnaire,
  QuestionnaireAudit
> {
  constructor(
    @InjectRepository(Questionnaire)
    protected readonly repository: Repository<Questionnaire>,
    @InjectRepository(QuestionnaireAudit)
    protected readonly auditRepository: Repository<QuestionnaireAudit>,
  ) {
    super(Questionnaire, repository, auditRepository, {});
  }

  public async find(
    criteria: SearchQuestionnaire,
  ): Promise<FindOutputDto<Questionnaire>> {
    const where = {
      ...(isDefined(criteria.title) && {
        title: ILike('%' + criteria.title + '%'),
      }),
      ...(isDefined(criteria.description) && {
        description: ILike('%' + criteria.description + '%'),
      }),
      ...(isDefined(criteria.types) && { type: In(criteria.types) }),
      ...(isDefined(criteria.is_active) && { is_active: criteria.is_active }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const relations: FindOptionsRelations<Questionnaire> = {
      ...(criteria.with_created_by && { created_by: true }),
    };

    return this.all(where, criteria, criteria.deleted_at, relations);
  }
}
