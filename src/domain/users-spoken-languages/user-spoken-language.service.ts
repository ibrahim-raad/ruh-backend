import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { UserSpokenLanguage } from './entities/user-spoken-language.entity';
import { SearchUserSpokenLanguage } from './dto/search-user-spoken-language.dto';
import { UserSpokenLanguageAudit } from './entities/user-spoken-language.entity.audit';
import { LanguageService } from '../languages/language.service';
import { DataSource } from 'typeorm';
import { FindOutputDto } from '../shared/dto/find-output,dto';
import { UserService } from '../users/user.service';
import { diff } from 'src/utils';

@Injectable()
export class UserSpokenLanguageService extends CrudService<
  UserSpokenLanguage,
  UserSpokenLanguageAudit
> {
  constructor(
    @InjectRepository(UserSpokenLanguage)
    protected readonly repository: Repository<UserSpokenLanguage>,
    @InjectRepository(UserSpokenLanguageAudit)
    protected readonly auditRepository: Repository<UserSpokenLanguageAudit>,
    private readonly languageService: LanguageService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {
    super(UserSpokenLanguage, repository, auditRepository, {
      language: true,
      user: true,
    });
  }

  public async create(input: UserSpokenLanguage): Promise<UserSpokenLanguage> {
    const language = await this.languageService.one({ id: input.language.id });
    const user = await this.userService.one({ id: input.user.id });
    const existing = await this.one(
      {
        user: { id: user.id },
        language: { id: language.id },
      },
      {
        user: true,
        language: true,
      },
      false,
      true,
    );

    if (existing) {
      if (existing.deleted_at) {
        const restored = await this.restore({ id: existing.id });
        return restored;
      }
      if (existing.is_primary == input.is_primary) {
        return existing;
      }
      return this.update(existing, input);
    }
    return this.dataSource.transaction(async (manager) => {
      await this.validateInput(input);
      const repo = manager.getRepository(UserSpokenLanguage);

      const entity = repo.create({
        ...input,
        language,
        user,
      });

      if (entity.is_primary) {
        await this.clearPrimary(manager, entity.user.id);
      }

      return await repo.save(entity);
    });
  }

  public async update(
    old: UserSpokenLanguage,
    input: UserSpokenLanguage,
  ): Promise<UserSpokenLanguage> {
    console.log('old:', old);
    console.log('input:', input);
    console.log('changes:', diff(old, input));

    return this.dataSource.transaction(async (manager) => {
      const changes = diff(old, input);
      if (changes) {
        await this.validateInput(changes);

        const repo = manager.getRepository(UserSpokenLanguage);

        if (changes.is_primary) {
          await this.clearPrimary(manager, old.userId);
          changes.is_primary = true;
        }

        return await repo.save(changes);
      }
      return old;
    });
  }

  private async clearPrimary(manager: EntityManager, userId: string) {
    await manager.update(
      UserSpokenLanguage,
      { user: { id: userId }, is_primary: true },
      { is_primary: false },
    );
  }

  public async find(
    criteria: SearchUserSpokenLanguage,
  ): Promise<FindOutputDto<UserSpokenLanguage>> {
    const where = {
      ...(isDefined(criteria.user_id) && {
        user: { id: criteria.user_id },
      }),
      ...(isDefined(criteria.language_id) && {
        language: { id: criteria.language_id },
      }),
      ...(isDefined(criteria.is_primary) && {
        is_primary: criteria.is_primary,
      }),
      ...(isDefined(criteria.language_ids) && {
        language: { id: In(criteria.language_ids) },
      }),
      ...(isDefined(criteria.user_ids) && {
        user: { id: In(criteria.user_ids) },
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
