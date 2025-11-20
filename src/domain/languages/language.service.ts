import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Language } from './entities/language.entity';
import { SearchLanguage } from './dto/search-language.dto';
import { LanguageAudit } from './entities/language.entity.audit';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class LanguageService extends CrudService<Language, LanguageAudit> {
  constructor(
    @InjectRepository(Language)
    protected readonly repository: Repository<Language>,
    @InjectRepository(LanguageAudit)
    protected readonly auditRepository: Repository<LanguageAudit>,
  ) {
    super(Language, repository, auditRepository, {});
  }

  public async find(
    criteria: SearchLanguage,
  ): Promise<FindOutputDto<Language>> {
    const where = {
      ...(isDefined(criteria.name) && {
        name: ILike('%' + criteria.name + '%'),
      }),
      ...(isDefined(criteria.code) && {
        code: ILike('%' + criteria.code + '%'),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
