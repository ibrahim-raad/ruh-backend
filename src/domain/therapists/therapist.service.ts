import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Therapist } from './entities/therapist.entity';
import { SearchTherapist } from './dto/search-therapist.dto';
import { TherapistAudit } from './entities/therapist.entity.audit';
import { UserService } from '../users/user.service';
import { FindOutputDto } from '../shared/dto/find-output,dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';
import { UserStatus } from '../users/shared/user-status.enum';

@Injectable()
export class TherapistService extends CrudService<Therapist, TherapistAudit> {
  constructor(
    @InjectRepository(Therapist)
    protected readonly repository: Repository<Therapist>,
    @InjectRepository(TherapistAudit)
    protected readonly auditRepository: Repository<TherapistAudit>,
    private readonly userService: UserService,
  ) {
    super(Therapist, repository, auditRepository, {
      user: {
        country: true,
        userSpokenLanguages: {
          language: true,
        },
      },
      currency: true,
      therapistSpecializations: {
        specialization: true,
      },
    });
  }

  public async update(old: Therapist, input: Therapist): Promise<Therapist> {
    await this.userService.update(old.user, input.user);
    return super.update(old, input);
  }

  public async find(
    criteria: SearchTherapist & { user_id?: string },
    currentUser: User,
  ): Promise<FindOutputDto<Therapist>> {
    const userWhere = this.userService.generateWhere(criteria);
    const isNotEmpty = Object.keys(userWhere).length > 0;
    const notAdminCondition =
      currentUser.role !== UserRole.ADMIN
        ? {
            ...(isDefined(criteria.user_id) && {
              id: criteria.user_id,
            }),
            status: UserStatus.ACTIVE,
          }
        : {};
    const where = {
      user: {
        ...notAdminCondition,
        ...(isNotEmpty && { ...userWhere }),
      },

      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
