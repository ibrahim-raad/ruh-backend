import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapistException } from './entities/therapist-exception.entity';
import { SearchTherapistException } from './dto/search-therapist-exception.dto';
import { TherapistExceptionAudit } from './entities/therapist-exception.entity.audit';
import { TherapistService } from '../therapists/therapist.service';
import { ClsService } from 'nestjs-cls';
import { SESSION_USER_KEY } from 'src/app.constants';
import { User } from '../users/entities/user.entity';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class TherapistExceptionService extends CrudService<
  TherapistException,
  TherapistExceptionAudit
> {
  constructor(
    @InjectRepository(TherapistException)
    protected readonly repository: Repository<TherapistException>,
    @InjectRepository(TherapistExceptionAudit)
    protected readonly auditRepository: Repository<TherapistExceptionAudit>,
    private readonly therapistService: TherapistService,
    private readonly clsService: ClsService,
  ) {
    super(TherapistException, repository, auditRepository, {
      therapist: {
        user: true,
      },
    });
  }

  public async create(input: TherapistException): Promise<TherapistException> {
    const user = this.clsService.get<{ user: User | undefined }>(
      SESSION_USER_KEY,
    )?.user;

    const therapist = await this.therapistService.one({
      user: { id: user?.id },
    });

    return super.create({
      ...input,
      therapist,
    });
  }

  public async find(
    criteria: SearchTherapistException,
  ): Promise<FindOutputDto<TherapistException>> {
    const where = {
      ...(isDefined(criteria.therapist_id) && {
        therapist: { id: criteria.therapist_id },
      }),
      ...(isDefined(criteria.date) && {
        date: criteria.date,
      }),
      ...(isDefined(criteria.is_available) && {
        is_available: criteria.is_available,
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }

  public async findTherapistExceptionsInRange(
    therapistId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<TherapistException[]> {
    return this.repository.find({
      where: {
        therapist: { id: therapistId },
        deleted_at: IsNull(),
        date: Between(rangeStart, rangeEnd),
      },
    });
  }
}
