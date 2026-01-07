import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateCurrency } from './dto/create-currency.dto';
import { Currency } from './entities/currency.entity';
import { UpdateCurrency } from './dto/update-currency.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { CurrencyOutput } from './dto/currency.output';

@Injectable()
export class CurrencyMapper {
  public toModel(input: CreateCurrency): Currency;

  public toModel(input: UpdateCurrency, existing: Currency): Currency;

  public toModel(
    input: CreateCurrency | UpdateCurrency,
    existing?: Currency,
  ): Currency {
    let data = {};

    if (input instanceof UpdateCurrency) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        name: input.name ?? existing?.name,
        code: input.code ?? existing?.code,
        symbol: input.symbol ?? existing?.symbol,
      };
    } else {
      data = {
        name: input.name,
        code: input.code,
        symbol: input.symbol,
      };
    }
    return Object.assign(new Currency(), existing ?? {}, data);
  }

  public toOutput(input: Currency): CurrencyOutput {
    return Object.assign(new CurrencyOutput(), {
      id: input.id,
      name: input.name,
      code: input.code,
      symbol: input.symbol,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
