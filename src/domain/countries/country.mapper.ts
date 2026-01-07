import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateCountry } from './dto/create-country.dto';
import { Country } from './entities/country.entity';
import { UpdateCountry } from './dto/update-country.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { CountryOutput } from './dto/country.output';

@Injectable()
export class CountryMapper {
  public toModel(input: CreateCountry): Country;

  public toModel(input: UpdateCountry, existing: Country): Country;

  public toModel(
    input: CreateCountry | UpdateCountry,
    existing?: Country,
  ): Country {
    let data = {};

    if (input instanceof UpdateCountry) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        name: input.name ?? existing?.name,
      };
    } else {
      data = {
        name: input.name,
      };
    }
    return Object.assign(new Country(), existing ?? {}, data);
  }

  public toOutput(input: Country): CountryOutput {
    return Object.assign(new CountryOutput(), {
      id: input.id,
      name: input.name,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
