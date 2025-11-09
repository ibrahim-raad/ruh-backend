import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapistAvailability } from './entities/therapist-availability.entity';
import { SearchTherapistAvailability } from './dto/search-therapist-availability.dto';
import { TherapistAvailabilityAudit } from './entities/therapist-availability.entity.audit';
import { ServiceValidationError } from 'src/errors/service-validation.error';
import { TherapistService } from '../therapists/therapist.service';
import { ClsService } from 'nestjs-cls';
import { SESSION_USER_KEY } from 'src/app.constants';
import { User } from '../users/entities/user.entity';
import { Therapist } from '../therapists/entities/therapist.entity';

@Injectable()
export class TherapistAvailabilityService extends CrudService<
  TherapistAvailability,
  TherapistAvailabilityAudit
> {
  constructor(
    @InjectRepository(TherapistAvailability)
    protected readonly repository: Repository<TherapistAvailability>,
    @InjectRepository(TherapistAvailabilityAudit)
    protected readonly auditRepository: Repository<TherapistAvailabilityAudit>,
    private readonly therapistService: TherapistService,
    private readonly clsService: ClsService,
  ) {
    super(TherapistAvailability, repository, auditRepository, {
      therapist: {
        user: true,
      },
    });
  }

  public async find(
    criteria: SearchTherapistAvailability,
  ): Promise<TherapistAvailability[]> {
    const where = {
      ...(isDefined(criteria.days_of_week) && {
        day_of_week: In(criteria.days_of_week),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }

  public async create(
    input: TherapistAvailability,
  ): Promise<TherapistAvailability> {
    const therapist = await this.getTherapist();
    if (
      this.timeToMinutes(input.start_time) >= this.timeToMinutes(input.end_time)
    ) {
      throw new ServiceValidationError(
        'End time must be greater than start time',
      );
    }

    const existing = await this.repository.findBy({
      therapist: { id: therapist.id },
      day_of_week: input.day_of_week,
    });

    if (
      existing.some((s) =>
        this.hasOverlap(
          s.start_time,
          s.end_time,
          input.start_time,
          input.end_time,
        ),
      )
    ) {
      throw new ConflictException('Overlapping availability');
    }

    return super.create(input);
  }

  public async update(
    old: TherapistAvailability,
    input: TherapistAvailability,
  ) {
    const next = Object.assign({}, old, input);
    const therapist = await this.getTherapist();
    if (therapist.id !== old.therapist?.id) {
      throw new ForbiddenException();
    }
    if (
      this.timeToMinutes(next.start_time) >= this.timeToMinutes(next.end_time)
    ) {
      throw new ServiceValidationError(
        'End time must be greater than start time',
      );
    }

    const existing = await this.repository.findBy({
      therapist: { id: therapist.id },
      day_of_week: next.day_of_week,
    });

    if (
      existing
        .filter((s) => s.id !== next.id)
        .some((s) =>
          this.hasOverlap(
            s.start_time,
            s.end_time,
            next.start_time,
            next.end_time,
          ),
        )
    ) {
      throw new ConflictException('Overlapping availability');
    }

    return super.update(old, input);
  }

  private async getTherapist(): Promise<Therapist> {
    const user = this.clsService.get<{ user: User | undefined }>(
      SESSION_USER_KEY,
    )?.user;
    const therapist = await this.therapistService.one({
      user: { id: user?.id },
    });
    return therapist;
  }

  private timeToMinutes(t: string): number {
    if (!t.includes(':')) {
      throw new ServiceValidationError('Invalid time format');
    }
    const [h, m] = t.split(':').map((x) => parseInt(x, 10));
    return h * 60 + (m || 0);
  }

  private hasOverlap(
    aStart: string,
    aEnd: string,
    bStart: string,
    bEnd: string,
  ): boolean {
    const as = this.timeToMinutes(aStart);
    const ae = this.timeToMinutes(aEnd);
    const bs = this.timeToMinutes(bStart);
    const be = this.timeToMinutes(bEnd);
    return as < be && bs < ae;
  }
}
