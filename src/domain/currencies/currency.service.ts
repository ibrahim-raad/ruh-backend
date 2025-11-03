import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Currency } from './entities/currency.entity';
import { SearchCurrency } from './dto/search-currency.dto';
import { CurrencyAudit } from './entities/currency.entity.audit';

@Injectable()
export class CurrencyService extends CrudService<Currency, CurrencyAudit> {
  constructor(
    @InjectRepository(Currency)
    protected readonly repository: Repository<Currency>,
    @InjectRepository(CurrencyAudit)
    auditRepository: Repository<CurrencyAudit>,
  ) {
    super(Currency, repository, auditRepository, {});
  }

  public async find(criteria: SearchCurrency): Promise<Currency[]> {
    const where = {
      ...(isDefined(criteria.name) && {
        name: ILike('%' + criteria.name + '%'),
      }),
      ...(isDefined(criteria.code) && {
        code: ILike('%' + criteria.code + '%'),
      }),
      ...(isDefined(criteria.symbol) && {
        symbol: ILike('%' + criteria.symbol + '%'),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
