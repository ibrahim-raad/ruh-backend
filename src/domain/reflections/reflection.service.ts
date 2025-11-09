import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Reflection } from './entities/reflection.entity';
import { SearchReflection } from './dto/search-reflection.dto';
import { ReflectionAudit } from './entities/reflection.entity.audit';
import { PatientService } from '../patients/patient.service';
import { ClsService } from 'nestjs-cls';
import { SESSION_USER_KEY } from 'src/app.constants';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReflectionService extends CrudService<
  Reflection,
  ReflectionAudit
> {
  constructor(
    @InjectRepository(Reflection)
    protected readonly repository: Repository<Reflection>,
    @InjectRepository(ReflectionAudit)
    protected readonly auditRepository: Repository<ReflectionAudit>,
    private readonly patientService: PatientService,
    private readonly clsService: ClsService,
  ) {
    super(Reflection, repository, auditRepository, {
      patient: {
        user: true,
      },
    });
  }

  public async create(input: Reflection): Promise<Reflection> {
    const user = this.clsService.get<{ user: User | undefined }>(
      SESSION_USER_KEY,
    )?.user;
    const patient = await this.patientService.one({
      user: { id: user?.id },
    });
    return super.create({
      ...input,
      patient,
    });
  }

  public async find(
    criteria: SearchReflection,
    exposed: boolean = false,
  ): Promise<Reflection[]> {
    const where = {
      ...(isDefined(criteria.title) && {
        title: ILike('%' + criteria.title + '%'),
      }),
      ...(isDefined(criteria.content) && {
        content: ILike('%' + criteria.content + '%'),
      }),
      ...(isDefined(criteria.mood) && {
        mood: criteria.mood,
      }),
      ...(isDefined(criteria.is_private) && {
        is_private: criteria.is_private,
      }),
      ...(exposed && {
        is_private: false,
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
