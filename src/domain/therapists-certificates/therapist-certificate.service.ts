import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapistCertificate } from './entities/therapist-certificate.entity';
import { SearchTherapistCertificate } from './dto/search-therapist-certificate.dto';
import { TherapistCertificateAudit } from './entities/therapist-certificate.entity.audit';
import { TherapistService } from '../therapists/therapist.service';
import { SpecializationService } from '../specializations/specialization.service';
import * as path from 'path';
import { FindOptionsWhere } from 'typeorm';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class TherapistCertificateService extends CrudService<
  TherapistCertificate,
  TherapistCertificateAudit
> {
  constructor(
    @InjectRepository(TherapistCertificate)
    protected readonly repository: Repository<TherapistCertificate>,
    @InjectRepository(TherapistCertificateAudit)
    protected readonly auditRepository: Repository<TherapistCertificateAudit>,
    private readonly therapistService: TherapistService,
    private readonly specializationService: SpecializationService,
  ) {
    super(TherapistCertificate, repository, auditRepository, {
      specialization: true,
      therapist: {
        user: true,
      },
    });
  }

  public async create(
    input: TherapistCertificate & { userId: string },
  ): Promise<TherapistCertificate> {
    const therapist = await this.therapistService.one({
      user: { id: input.userId },
    });
    const specialization =
      (await this.specializationService.one(
        {
          id: input.specialization?.id,
        },
        {},
        false,
      )) ?? undefined;
    return super.create({
      ...input,
      therapist,
      specialization,
    });
  }

  public async update(
    old: TherapistCertificate,
    input: TherapistCertificate,
  ): Promise<TherapistCertificate> {
    const specialization =
      (await this.specializationService.one(
        {
          id: input.specialization?.id,
        },
        {},
        false,
      )) ?? old.specialization;
    return super.update(old, { ...input, specialization });
  }

  public async find(
    criteria: SearchTherapistCertificate,
  ): Promise<FindOutputDto<TherapistCertificate>> {
    const where = {
      ...(isDefined(criteria.title) && {
        title: ILike('%' + criteria.title + '%'),
      }),
      ...(isDefined(criteria.issuer) && {
        issuer: ILike('%' + criteria.issuer + '%'),
      }),
      ...(isDefined(criteria.issued_date) && {
        issued_date: criteria.issued_date,
      }),
      ...(isDefined(criteria.description) && {
        description: ILike('%' + criteria.description + '%'),
      }),
      ...(isDefined(criteria.specialization_id) && {
        specialization: { id: criteria.specialization_id },
      }),
      ...(isDefined(criteria.therapist_id) && {
        therapist: { id: criteria.therapist_id },
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }

  public async replaceFile(
    findOptions: FindOptionsWhere<TherapistCertificate>,
    file: Express.Multer.File,
  ): Promise<TherapistCertificate> {
    const existing = await this.one(findOptions);
    const uploadsPrefix = '/uploads/';
    if (existing.file_url?.startsWith(uploadsPrefix)) {
      const filePath = path.join(
        process.cwd(),
        existing.file_url.replace(uploadsPrefix, 'uploads/'),
      );
      this.removeFile(filePath);
    }
    existing.file_url = `/uploads/therapists/certificates/${file.filename}`;
    return this.repository.save(existing);
  }

  public async permanentDelete(
    criteria: FindOptionsWhere<TherapistCertificate>,
  ): Promise<{ message: string }> {
    const existing = await this.one(criteria);
    const uploadsPrefix = '/uploads/';
    if (existing.file_url?.startsWith(uploadsPrefix)) {
      const filePath = path.join(
        process.cwd(),
        existing.file_url.replace(uploadsPrefix, 'uploads/'),
      );
      this.removeFile(filePath);
    }
    return super.permanentDelete(criteria);
  }
}
