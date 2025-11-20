import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { AssignedExercise } from './entities/assigned-exercise.entity';
import { SearchAssignedExercise } from './dto/search-assigned-exercise.dto';
import { AssignedExerciseAudit } from './entities/assigned-exercise.entity.audit';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';
import { TherapyCaseService } from '../therapy-cases/therapy-case.service';
import { ExerciseService } from '../exercises/exercise.service';
import { ClsService } from 'nestjs-cls';
import { SESSION_USER_KEY } from 'src/app.constants';
import { ExerciseVisibility } from '../exercises/shared/exercise-visibility.enum';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class AssignedExerciseService extends CrudService<
  AssignedExercise,
  AssignedExerciseAudit
> {
  constructor(
    @InjectRepository(AssignedExercise)
    protected readonly repository: Repository<AssignedExercise>,
    @InjectRepository(AssignedExerciseAudit)
    protected readonly auditRepository: Repository<AssignedExerciseAudit>,
    private readonly therapyCaseService: TherapyCaseService,
    private readonly exerciseService: ExerciseService,
    private readonly clsService: ClsService,
  ) {
    super(AssignedExercise, repository, auditRepository, {
      exercise: true,
      therapy_case: {
        patient: {
          user: true,
        },
        therapist: {
          user: true,
        },
      },
    });
  }

  public async create(input: AssignedExercise): Promise<AssignedExercise> {
    const user = this.clsService.get<{ user: User | undefined }>(
      SESSION_USER_KEY,
    )?.user;
    const therapyCase = await this.therapyCaseService.one({
      id: input.therapy_case.id,
      therapist: { user: { id: user?.id } },
    });
    const exercise = await this.exerciseService.one({ id: input.exercise.id });
    if (
      exercise.visibility === ExerciseVisibility.PRIVATE &&
      exercise.created_by_id !== user?.id
    ) {
      throw new UnauthorizedException(
        'You are not authorized to assign this exercise',
      );
    }
    const entity = Object.assign(new AssignedExercise(), input, {
      therapy_case: therapyCase,
      exercise: exercise,
    });
    return super.create(entity);
  }

  public async find(
    criteria: SearchAssignedExercise,
    therapyCaseId: string,
    currentUser: User,
  ): Promise<FindOutputDto<AssignedExercise>> {
    const where = {
      ...(isDefined(criteria.completion_notes) && {
        completion_notes: ILike('%' + criteria.completion_notes + '%'),
      }),
      ...(isDefined(criteria.statuses) && {
        status: In(criteria.statuses),
      }),
      ...(isDefined(criteria.exercise_id) && {
        exercise: { id: criteria.exercise_id },
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
      ...this.getAccessCondition(therapyCaseId, currentUser),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }

  public getAccessCondition(
    therapyCaseId: string,
    currentUser: User,
  ): Record<string, any> {
    let accessCondition: Record<string, any> = {};

    switch (currentUser.role) {
      case UserRole.ADMIN:
        accessCondition = {
          therapy_case: { id: therapyCaseId },
        };
        break;
      case UserRole.THERAPIST:
        accessCondition = {
          therapy_case: {
            id: therapyCaseId,
            therapist: { user: { id: currentUser.id } },
          },
        };
        break;
      case UserRole.PATIENT:
        accessCondition = {
          therapy_case: {
            id: therapyCaseId,
            patient: { user: { id: currentUser.id } },
          },
        };
        break;
    }
    return accessCondition;
  }
}
