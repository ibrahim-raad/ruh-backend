import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { SessionAiSummary } from './entities/session-ai-summary.entity';
import { SearchSessionAiSummary } from './dto/search-session-ai-summary.dto';
import { SessionAiSummaryAudit } from './entities/session-ai-summary.entity.audit';
import { SessionService } from '../sessions/session.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';

@Injectable()
export class SessionAiSummaryService extends CrudService<
  SessionAiSummary,
  SessionAiSummaryAudit
> {
  constructor(
    @InjectRepository(SessionAiSummary)
    protected readonly repository: Repository<SessionAiSummary>,
    @InjectRepository(SessionAiSummaryAudit)
    protected readonly auditRepository: Repository<SessionAiSummaryAudit>,
    private readonly sessionService: SessionService,
  ) {
    super(SessionAiSummary, repository, auditRepository, {
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

  public async create(input: SessionAiSummary): Promise<SessionAiSummary> {
    const session = await this.sessionService.one({ id: input.sessionId });
    return super.create({
      ...input,
      session,
    });
  }

  public async find(
    criteria: SearchSessionAiSummary,
    user: User,
  ): Promise<SessionAiSummary[]> {
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
      ...(isDefined(criteria.summary) && {
        summary: ILike('%' + criteria.summary + '%'),
      }),
      ...accessCondition,
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
