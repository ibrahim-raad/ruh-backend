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

@Injectable()
export class UserSpokenLanguageService extends CrudService<
  UserSpokenLanguage,
  UserSpokenLanguageAudit
> {
  constructor(
    @InjectRepository(UserSpokenLanguage)
    protected readonly repository: Repository<UserSpokenLanguage>,
    @InjectRepository(UserSpokenLanguageAudit)
    auditRepository: Repository<UserSpokenLanguageAudit>,
    private readonly languageService: LanguageService,
    private readonly dataSource: DataSource,
  ) {
    super(UserSpokenLanguage, repository, auditRepository, {
      language: true,
      user: true,
    });
  }

  public async create(input: UserSpokenLanguage): Promise<UserSpokenLanguage> {
    return this.dataSource.transaction(async (manager) => {
      await this.validateInput(input);
      const repo = manager.getRepository(UserSpokenLanguage);

      const entity = repo.create({
        ...input,
        language: { id: input.language.id },
        user: { id: input.user.id },
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
    return this.dataSource.transaction(async (manager) => {
      const merged = Object.assign(new UserSpokenLanguage(), old, input);
      await this.validateInput(merged);

      const repo = manager.getRepository(UserSpokenLanguage);

      if (merged.is_primary) {
        await this.clearPrimary(manager, old.userId);
        merged.is_primary = true;
      }

      return await repo.save(merged);
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
  ): Promise<UserSpokenLanguage[]> {
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

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
