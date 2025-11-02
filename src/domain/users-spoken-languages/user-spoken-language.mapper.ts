import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateUserSpokenLanguage } from './dto/create-user-spoken-language.dto';
import { UserSpokenLanguage } from './entities/user-spoken-language.entity';
import { UpdateUserSpokenLanguage } from './dto/update-user-spoken-language.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { UserSpokenLanguageOutput } from './dto/user-spoken-language.output';
import { UserMapper } from '../users/user.mapper';
import { LanguageMapper } from '../languages/language.mapper';

@Injectable()
export class UserSpokenLanguageMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly languageMapper: LanguageMapper,
  ) {}
  public toModel(input: CreateUserSpokenLanguage): UserSpokenLanguage;

  public toModel(
    input: UpdateUserSpokenLanguage,
    existing: UserSpokenLanguage,
  ): UserSpokenLanguage;

  public toModel(
    input: CreateUserSpokenLanguage | UpdateUserSpokenLanguage,
    existing?: UserSpokenLanguage,
  ): UserSpokenLanguage {
    let data = {};

    if (input instanceof UpdateUserSpokenLanguage) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        is_primary: input.is_primary ?? existing?.is_primary,
        language: existing?.language,
        user: existing?.user,
      };
    } else {
      data = {
        language: { id: input.language_id },
        is_primary: input.is_primary,
      };
    }
    return Object.assign(new UserSpokenLanguage(), existing ?? {}, data);
  }

  public toOutput(input: UserSpokenLanguage): UserSpokenLanguageOutput {
    return Object.assign(new UserSpokenLanguageOutput(), {
      id: input.id,
      user_id: input.userId,
      user: input.user ? this.userMapper.toOutput(input.user) : undefined,
      language_id: input.languageId,
      language: input.language
        ? this.languageMapper.toOutput(input.language)
        : undefined,
      is_primary: input.is_primary,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
