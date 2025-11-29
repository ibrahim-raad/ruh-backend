import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateUser } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUser } from './dto/update-user.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { UserOutput } from './dto/user.output';
import { UserStatus } from './shared/user-status.enum';
import { UserEmailStatus } from './shared/user-email-status.enum';
import { UserRole } from './shared/user-role.enum';
import { CountryMapper } from '../countries/country.mapper';
import { SignupUser } from '../auth/dto/signup-user.dto';
import { UserGender } from './shared/user-gender.enum';
import { UserPasswordStrategy } from './user-password-strategy.service';
import { LanguageOutput } from '../languages/dto/language.output';
import { UserSpokenLanguage } from '../users-spoken-languages/entities/user-spoken-language.entity';

@Injectable()
export class UserMapper {
  constructor(
    private readonly countryMapper: CountryMapper,
    private readonly strategy: UserPasswordStrategy,
  ) {}
  public toModel(input: CreateUser): User;
  public toModel(input: SignupUser): User;
  public toModel(input: UpdateUser, existing: User): User;

  public toModel(
    input: CreateUser | SignupUser | UpdateUser,
    existing?: User,
  ): User {
    let data = {};

    if (input instanceof UpdateUser) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        full_name: input.full_name ?? existing?.full_name,
        gender: input.gender ?? existing?.gender,
        country: input.country_id
          ? { id: input.country_id }
          : existing?.country,
        date_of_birth: input.date_of_birth ?? existing?.date_of_birth,
      };
    } else if (input instanceof SignupUser) {
      data = {
        full_name: input.full_name,
        email: input.email,
        password: this.strategy.hash(input.password),
        role: input.role,
        gender: UserGender.UNKNOWN,
      };
    } else {
      data = {
        full_name: input.full_name,
        email: input.email,
        password: this.strategy.hash(input.password),
        role: input.role,
        gender: input.gender,
        country: input.country_id ? { id: input.country_id } : undefined,
        date_of_birth: input.date_of_birth,
        status:
          input.role === UserRole.THERAPIST
            ? UserStatus.PENDING
            : UserStatus.ACTIVE,
        email_status:
          input.role === UserRole.ADMIN
            ? UserEmailStatus.VERIFIED
            : UserEmailStatus.UNVERIFIED,
      };
    }
    return Object.assign(new User(), existing ?? {}, data);
  }

  public toOutput(input: User): UserOutput {
    return Object.assign(new UserOutput(), {
      id: input.id,
      full_name: input.full_name,
      email: input.email,
      role: input.role,
      gender: input.gender,
      country: input.country
        ? this.countryMapper.toOutput(input.country)
        : undefined,
      country_id: input.countryId,
      date_of_birth: input.date_of_birth,
      status: input.status,
      email_status: input.email_status,
      profile_url: input.profile_url,
      spoken_languages: input.userSpokenLanguages
        ? input.userSpokenLanguages.map((language) =>
            this.toLanguageOutput(language),
          )
        : [],
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }

  private toLanguageOutput(input: UserSpokenLanguage): LanguageOutput {
    return Object.assign(new LanguageOutput(), {
      id: input.id,
      name: input.language?.name,
      code: input.language?.code,
    });
  }
}
