import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { SessionReport } from './entities/session-report.entity';
import { SearchSessionReport } from './dto/search-session-report.dto';
import { SessionReportAudit } from './entities/session-report.entity.audit';
import { SessionService } from '../sessions/session.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class SessionReportService extends CrudService<
  SessionReport,
  SessionReportAudit
> {
  constructor(
    @InjectRepository(SessionReport)
    protected readonly repository: Repository<SessionReport>,
    @InjectRepository(SessionReportAudit)
    protected readonly auditRepository: Repository<SessionReportAudit>,
    private readonly sessionService: SessionService,
  ) {
    super(SessionReport, repository, auditRepository, {});
  }

  public async create(input: SessionReport): Promise<SessionReport> {
    const session = await this.sessionService.one({ id: input.session.id });
    const entity = Object.assign(new SessionReport(), input, {
      session,
    });
    return super.create(entity);
  }

  public async find(
    criteria: SearchSessionReport,
    user: User,
  ): Promise<FindOutputDto<SessionReport>> {
    let accessCondition = {};

    switch (user.role) {
      case UserRole.ADMIN:
        accessCondition = {
          ...(isDefined(criteria.session_id) && {
            session: {
              id: criteria.session_id,
            },
          }),
        };
        break;
      case UserRole.THERAPIST:
        accessCondition = {
          session: {
            ...(isDefined(criteria.session_id) && {
              id: criteria.session_id,
            }),
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
            ...(isDefined(criteria.session_id) && {
              id: criteria.session_id,
            }),
            therapy_case: {
              patient: {
                user: { id: user.id },
              },
            },
          },
        };
        break;
    }
    const where = {
      ...(isDefined(criteria.overview) && {
        overview: ILike('%' + criteria.overview + '%'),
      }),
      ...(isDefined(criteria.diagnosis) && {
        diagnosis: ILike('%' + criteria.diagnosis + '%'),
      }),
      ...(isDefined(criteria.next_steps) && {
        next_steps: ILike('%' + criteria.next_steps + '%'),
      }),
      ...(isDefined(criteria.recommendations) && {
        recommendations: ILike('%' + criteria.recommendations + '%'),
      }),
      ...(isDefined(criteria.ai_assisted) && {
        ai_assisted: criteria.ai_assisted,
      }),
      ...(isDefined(criteria.is_finalized) && {
        is_finalized: criteria.is_finalized,
      }),
      ...accessCondition,
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
