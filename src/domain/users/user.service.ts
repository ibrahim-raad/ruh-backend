import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { isDefined } from 'class-validator';
import { User } from './entities/user.entity';
import { SearchUser } from './dto/search-user.dto';
import { UserAudit } from './entities/user.entity.audit';
import { CountryService } from '../countries/country.service';
import { InRange } from '../shared/find-operator.extensions';
import { CrudService } from '../shared/abstract-crud.service';
import { Patient } from '../patients/entities/patient.entity';
import { Therapist } from '../therapists/entities/therapist.entity';
import * as path from 'path';

@Injectable()
export class UserService extends CrudService<User, UserAudit> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    @InjectRepository(UserAudit)
    protected readonly auditRepository: Repository<UserAudit>,
    private readonly countryService: CountryService,
    private readonly dataSource: DataSource,
  ) {
    super(User, repository, auditRepository, {
      country: true,
    });
  }

  public async create(input: User): Promise<User> {
    const country = await this.countryService.one({ id: input.countryId });
    return super.create({ ...input, country });
  }

  public async update(old: User, input: User): Promise<User> {
    let newInput = input;
    if (input.country?.id !== old.countryId) {
      const country = await this.countryService.one({ id: input.countryId });
      newInput = Object.assign(new User(), newInput, { country });
    }
    return super.update(old, newInput);
  }

  public async createUserWithPatient(input: User): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = userRepo.create(input);
      const savedUser = await userRepo.save(user);
      const patientRepo = manager.getRepository(Patient);
      const patient = patientRepo.create({ user: savedUser });
      await patientRepo.save(patient);
      return savedUser;
    });
  }
  public async createUserWithTherapist(input: User): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = userRepo.create(input);
      const savedUser = await userRepo.save(user);
      const therapistRepo = manager.getRepository(Therapist);
      const therapist = therapistRepo.create({ user: savedUser });
      await therapistRepo.save(therapist);
      return savedUser;
    });
  }

  public generateWhere(criteria: SearchUser): FindOptionsWhere<User> {
    return {
      // TODO: Add name search
      // ...(isDefined(criteria.name) && {
      //   name: ILike('%' + criteria.name + '%'),
      // }),
      ...(isDefined(criteria.email) && {
        email: ILike('%' + criteria.email + '%'),
      }),
      ...(isDefined(criteria.roles) && { role: In(criteria.roles) }),
      ...(isDefined(criteria.statuses) && { status: In(criteria.statuses) }),
      ...(isDefined(criteria.email_status) && {
        email_status: criteria.email_status,
      }),
      ...(isDefined(criteria.date_of_birth_range) && {
        date_of_birth: InRange(criteria.date_of_birth_range),
      }),
      ...(isDefined(criteria.gender) && { gender: criteria.gender }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };
  }

  public async find(criteria: SearchUser): Promise<User[]> {
    const where = this.generateWhere(criteria);
    return this.all(where, criteria, criteria.deleted_at);
  }

  public async setProfileImage(
    findOptions: FindOptionsWhere<User>,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.one(findOptions);
    const uploadsPrefix = '/uploads/';
    if (user.profile_url?.startsWith(uploadsPrefix)) {
      const filePath = path.join(
        process.cwd(),
        user.profile_url.replace(uploadsPrefix, 'uploads/'),
      );
      this.removeFile(filePath);
    }
    const url = `/uploads/profile-images/${file.filename}`;
    user.profile_url = url;
    return this.repository.save(user);
  }

  public async deleteProfileImage(
    findOptions: FindOptionsWhere<User>,
  ): Promise<User> {
    const user = await this.one(findOptions);
    const uploadsPrefix = '/uploads/';
    if (user.profile_url?.startsWith(uploadsPrefix)) {
      const filePath = path.join(
        process.cwd(),
        user.profile_url.replace(uploadsPrefix, 'uploads/'),
      );
      this.removeFile(filePath);
    }
    user.profile_url = undefined;
    return this.repository.save(user);
  }
}
