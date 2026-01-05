import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ILike,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Session } from './entities/session.entity';
import { SearchSession } from './dto/search-session.dto';
import { SessionAudit } from './entities/session.entity.audit';
import { TherapyCaseService } from '../therapy-cases/therapy-case.service';
import { TherapistSettingsService } from '../therapists-settings/therapist-settings.service';
import { FindOutputDto } from '../shared/dto/find-output,dto';
import { SessionStatus } from './shared/session-status.enum';

@Injectable()
export class SessionService extends CrudService<Session, SessionAudit> {
  constructor(
    @InjectRepository(Session)
    protected readonly repository: Repository<Session>,
    @InjectRepository(SessionAudit)
    protected readonly auditRepository: Repository<SessionAudit>,
    private readonly therapyCaseService: TherapyCaseService,
    private readonly therapistSettingsService: TherapistSettingsService,
  ) {
    super(Session, repository, auditRepository, {
      therapy_case: {
        patient: {
          user: {
            country: true,
          },
        },
        therapist: {
          therapistCertificates: true,
          therapistSpecializations: {
            specialization: true,
          },
          user: {
            country: true,
          },
        },
      },
    });
  }

  public async create(input: Session): Promise<Session> {
    const therapyCase = await this.therapyCaseService.one(
      {
        id: input.therapy_case.id,
      },
      {
        therapist: true,
      },
    );
    const therapistSettings = await this.therapistSettingsService.one({
      therapist: { id: therapyCase.therapist.id },
    });

    const startTime = new Date(input.start_time);
    const sessionDuration = therapistSettings.session_duration_minutes;
    const endTime = new Date(startTime.getTime() + sessionDuration * 60000);

    // TODO: create session links
    const entity = Object.assign(new Session(), input, {
      therapy_case: therapyCase,
      start_time: startTime,
      end_time: endTime,
    });
    return super.create(entity);
  }

  public async find(criteria: SearchSession): Promise<FindOutputDto<Session>> {
    const where = {
      ...(isDefined(criteria.type) && {
        type: criteria.type,
      }),
      ...(isDefined(criteria.statuses) && {
        status: In(criteria.statuses),
      }),
      ...(isDefined(criteria.therapy_case_id) && {
        therapy_case: { id: criteria.therapy_case_id },
      }),
      ...(isDefined(criteria.before_date) && {
        start_time: LessThanOrEqual(criteria.before_date),
      }),
      ...(isDefined(criteria.after_date) && {
        start_time: MoreThanOrEqual(criteria.after_date),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }

  public async findBlockingTherapistSessionsInRange(
    therapistId: string,
    rangeStart: Date,
    rangeEnd: Date,
    statuses: SessionStatus[] = [
      SessionStatus.PENDING,
      SessionStatus.CONFIRMED,
      SessionStatus.RESCHEDULED,
    ],
  ): Promise<Session[]> {
    const data = await this.repository.find({
      where: {
        therapy_case: { therapist: { id: therapistId } },
        deleted_at: IsNull(),
        status: In(statuses),
        start_time: MoreThanOrEqual(rangeStart),
        end_time: LessThanOrEqual(rangeEnd),
      },
    });
    return data;
  }
}
