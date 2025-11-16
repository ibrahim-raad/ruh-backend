import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { PatientFileDocument } from './entities/patient-file-document.entity';
import { SearchPatientFileDocument } from './dto/search-patient-file-document.dto';
import { PatientFileDocumentAudit } from './entities/patient-file-document.entity.audit';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';
import { TherapyCaseService } from '../therapy-cases/therapy-case.service';
import * as path from 'path';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class PatientFileDocumentService extends CrudService<
  PatientFileDocument,
  PatientFileDocumentAudit
> {
  constructor(
    @InjectRepository(PatientFileDocument)
    protected readonly repository: Repository<PatientFileDocument>,
    @InjectRepository(PatientFileDocumentAudit)
    protected readonly auditRepository: Repository<PatientFileDocumentAudit>,
    private readonly therapyCaseService: TherapyCaseService,
  ) {
    super(PatientFileDocument, repository, auditRepository, {
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

  public async create(
    input: PatientFileDocument,
  ): Promise<PatientFileDocument> {
    const therapyCase = await this.therapyCaseService.one({
      id: input.therapy_case.id,
    });
    return super.create({
      ...input,
      therapy_case: therapyCase,
    });
  }

  public async find(
    criteria: SearchPatientFileDocument,
    user: User,
    therapyCaseId: string,
    patientId?: string,
  ): Promise<PatientFileDocument[]> {
    const accessCondition = this.accessCondition(
      user,
      therapyCaseId,
      criteria.patient_id,
    );
    const where = {
      ...(isDefined(criteria.description) && {
        description: ILike('%' + criteria.description + '%'),
      }),
      ...(isDefined(criteria.types) && {
        type: In(criteria.types),
      }),
      ...(isDefined(criteria.is_uploaded_by_patient) && {
        is_uploaded_by_patient: criteria.is_uploaded_by_patient,
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
      ...accessCondition,
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }

  public accessCondition(
    user: User,
    therapyCaseId: string,
    patientId?: string,
  ): Record<string, any> {
    let accessCondition: Record<string, any> = {};

    switch (user.role) {
      case UserRole.ADMIN:
        accessCondition = {
          therapy_case: { id: therapyCaseId },
          ...(isDefined(patientId) && { patient: { id: patientId } }),
        };
        break;
      case UserRole.THERAPIST:
        accessCondition = {
          therapy_case: {
            id: therapyCaseId,
            therapist: { user: { id: user.id } },
          },
        };
        break;
      case UserRole.PATIENT:
        accessCondition = {
          therapy_case: {
            id: therapyCaseId,
            patient: { user: { id: user.id } },
          },
        };
        break;
    }
    return accessCondition;
  }

  public async replaceFile(
    findOptions: FindOptionsWhere<PatientFileDocument>,
    file: Express.Multer.File,
  ): Promise<PatientFileDocument> {
    const existing = await this.one(findOptions);
    const uploadsPrefix = '/uploads/';
    if (existing.file_url?.startsWith(uploadsPrefix)) {
      const filePath = path.join(
        process.cwd(),
        existing.file_url.replace(uploadsPrefix, 'uploads/'),
      );
      this.removeFile(filePath);
    }
    existing.file_url = `/uploads/patients/documents/${file.filename}`;
    return this.repository.save(existing);
  }

  public async permanentDelete(
    criteria: FindOptionsWhere<PatientFileDocument>,
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
