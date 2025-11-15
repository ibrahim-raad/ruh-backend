import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreatePatientFileDocument } from './dto/create-patient-file-document.dto';
import { PatientFileDocument } from './entities/patient-file-document.entity';
import { UpdatePatientFileDocument } from './dto/update-patient-file-document.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { PatientFileDocumentOutput } from './dto/patient-file-document.output';
import { TherapyCaseMapper } from '../therapy-cases/therapy-case.mapper';

@Injectable()
export class PatientFileDocumentMapper {
  constructor(private readonly therapyCaseMapper: TherapyCaseMapper) {}
  public toModel(
    input: CreatePatientFileDocument & {
      therapyCaseId: string;
      isUploadedByPatient: boolean;
    },
  ): PatientFileDocument;

  public toModel(
    input: UpdatePatientFileDocument,
    existing: PatientFileDocument,
  ): PatientFileDocument;

  public toModel(
    input:
      | (CreatePatientFileDocument & {
          therapyCaseId: string;
          isUploadedByPatient: boolean;
        })
      | UpdatePatientFileDocument,
    existing?: PatientFileDocument,
  ): PatientFileDocument {
    let data = {};

    if (input instanceof UpdatePatientFileDocument) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        description: input.description ?? existing?.description,
      };
    } else {
      data = {
        description: input.description,
        type: input.type,
        is_uploaded_by_patient: input.isUploadedByPatient,
        therapy_case: { id: input.therapyCaseId },
      };
    }
    return Object.assign(new PatientFileDocument(), existing ?? {}, data);
  }

  public toOutput(input: PatientFileDocument): PatientFileDocumentOutput {
    return Object.assign(new PatientFileDocumentOutput(), {
      id: input.id,
      file_url: input.file_url,
      description: input.description,
      type: input.type,
      is_uploaded_by_patient: input.is_uploaded_by_patient,
      therapy_case_id: input.therapyCaseId,
      therapy_case: input.therapy_case
        ? this.therapyCaseMapper.toOutput(input.therapy_case)
        : undefined,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
