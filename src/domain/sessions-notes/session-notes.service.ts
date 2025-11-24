import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { SessionNotes } from './entities/session-notes.entity';
import { SearchSessionNotes } from './dto/search-session-notes.dto';
import { SessionNotesAudit } from './entities/session-notes.entity.audit';
import { SessionService } from '../sessions/session.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class SessionNotesService extends CrudService<
  SessionNotes,
  SessionNotesAudit
> {
  constructor(
    @InjectRepository(SessionNotes)
    protected readonly repository: Repository<SessionNotes>,
    @InjectRepository(SessionNotesAudit)
    protected readonly auditRepository: Repository<SessionNotesAudit>,
    private readonly sessionService: SessionService,
  ) {
    super(SessionNotes, repository, auditRepository, {
      session: {
        therapy_case: {
          therapist: {
            user: true,
          },
          patient: {
            user: true,
          },
        },
      },
    });
  }

  public async create(input: SessionNotes): Promise<SessionNotes> {
    const session = await this.sessionService.one({ id: input.session?.id });
    return super.create({
      ...input,
      session,
    });
  }

  public async find(
    criteria: SearchSessionNotes,
    user: User,
  ): Promise<FindOutputDto<SessionNotes>> {
    let accessCondition = {};

    switch (user.role) {
      case UserRole.ADMIN:
        break;
      case UserRole.THERAPIST:
        accessCondition = {
          session: {
            therapy_case: {
              therapist: {
                user: { id: user.id },
              },
            },
          },
        };
        break;
      case UserRole.PATIENT:
        accessCondition = {
          session: {
            therapy_case: {
              patient: { user: { id: user.id } },
            },
          },
        };
        break;
    }
    const where = {
      ...(isDefined(criteria.content) && {
        content: ILike('%' + criteria.content + '%'),
      }),
      ...accessCondition,
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
