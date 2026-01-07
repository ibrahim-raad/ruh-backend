import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateLanguage } from './dto/create-language.dto';
import { Language } from './entities/language.entity';
import { UpdateLanguage } from './dto/update-language.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { LanguageOutput } from './dto/language.output';

@Injectable()
export class LanguageMapper {
  public toModel(input: CreateLanguage): Language;

  public toModel(input: UpdateLanguage, existing: Language): Language;

  public toModel(
    input: CreateLanguage | UpdateLanguage,
    existing?: Language,
  ): Language {
    let data = {};

    if (input instanceof UpdateLanguage) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        name: input.name ?? existing?.name,
        code: input.code ?? existing?.code,
      };
    } else {
      data = {
        name: input.name,
        code: input.code,
      };
    }
    return Object.assign(new Language(), existing ?? {}, data);
  }

  public toOutput(input: Language): LanguageOutput {
    return Object.assign(new LanguageOutput(), {
      id: input.id,
      name: input.name,
      code: input.code,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
