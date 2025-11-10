import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Exercise } from './entities/exercise.entity';
import { SearchExercise } from './dto/search-exercise.dto';
import { ExerciseAudit } from './entities/exercise.entity.audit';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';
import { ExerciseVisibility } from './shared/exercise-visibility.enum';

@Injectable()
export class ExerciseService extends CrudService<Exercise, ExerciseAudit> {
  constructor(
    @InjectRepository(Exercise)
    protected readonly repository: Repository<Exercise>,
    @InjectRepository(ExerciseAudit)
    protected readonly auditRepository: Repository<ExerciseAudit>,
  ) {
    super(Exercise, repository, auditRepository, {
      created_by: true,
    });
  }

  public async find(
    criteria: SearchExercise,
    currentUser: User,
  ): Promise<Exercise[]> {
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isTherapist = currentUser.role === UserRole.THERAPIST;
    const isPatient = currentUser.role === UserRole.PATIENT;

    const where: FindOptionsWhere<Exercise> = {
      ...(isDefined(criteria.title) && {
        title: ILike('%' + criteria.title + '%'),
      }),
      ...(isDefined(criteria.description) && {
        description: ILike('%' + criteria.description + '%'),
      }),
      ...(isDefined(criteria.visibility) && {
        visibility: criteria.visibility,
      }),
      ...(isDefined(criteria.category) && {
        category: criteria.category,
      }),
      ...(isDefined(criteria.created_by_id) && {
        created_by: { id: criteria.created_by_id },
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    // TODO: handle visibility for these cases:
    // admin can see all exercises
    // therapist can see all his exercises and global ones from other therapists
    // patient can see all global exercises and his assigned exercises
    // answer this question: if the global exercises are visible to the therapist and patients, what are the public ones?
    // if (isTherapist) {
    //   if (isDefined(criteria.created_by_id)) {
    //     if (criteria.created_by_id !== currentUser.id)
    //       where.visibility = ExerciseVisibility.GLOBAL;
    //   }
    // }

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
