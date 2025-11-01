import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Country } from './entities/country.entity';
import { SearchCountry } from './dto/search-country.dto';
import { CountryAudit } from './entities/country.entity.audit';

@Injectable()
export class CountryService extends CrudService<Country, CountryAudit> {
  constructor(
    @InjectRepository(Country)
    protected readonly repository: Repository<Country>,
    @InjectRepository(CountryAudit)
    auditRepository: Repository<CountryAudit>,
  ) {
    super(Country, repository, auditRepository, {});
  }

  public async find(criteria: SearchCountry): Promise<Country[]> {
    const where = {
      ...(isDefined(criteria.name) && { name: ILike(`%${criteria.name}%`) }),
      ...(criteria.deleted_at && {
        deleted_at: Not(IsNull()),
      }),
    };

    const countries = await this.all(where, criteria, criteria.deleted_at);
    return countries;
  }
}
