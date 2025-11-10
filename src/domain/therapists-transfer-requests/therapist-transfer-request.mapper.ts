import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateTherapistTransferRequest } from './dto/create-therapist-transfer-request.dto';
import { TherapistTransferRequest } from './entities/therapist-transfer-request.entity';
import { UpdateTherapistTransferRequest } from './dto/update-therapist-transfer-request.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { TherapistTransferRequestOutput } from './dto/therapist-transfer-request.output';
import { TherapistMapper } from '../therapists/therapist.mapper';
import { PatientMapper } from '../patients/patient.mapper';
import { TherapyCaseMapper } from '../therapy-cases/therapy-case.mapper';
import { TherapistTransferRequestStatus } from './shared/therapist-transfer-request-status.enum';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TherapistTransferRequestMapper {
  constructor(
    private readonly therapistMapper: TherapistMapper,
    private readonly patientMapper: PatientMapper,
    private readonly therapyCaseMapper: TherapyCaseMapper,
    private readonly clsService: ClsService,
  ) {}
  public toModel(
    input: CreateTherapistTransferRequest,
  ): TherapistTransferRequest;

  public toModel(
    input: UpdateTherapistTransferRequest,
    existing: TherapistTransferRequest,
  ): TherapistTransferRequest;

  public toModel(
    input: CreateTherapistTransferRequest | UpdateTherapistTransferRequest,
    existing?: TherapistTransferRequest,
  ): TherapistTransferRequest {
    let data = {};

    if (input instanceof UpdateTherapistTransferRequest) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        transfer_reason: existing?.transfer_reason,
        status_reason: input.status_reason ?? existing?.status_reason,
        status: input.status ?? existing?.status,
        therapist: existing?.therapist,
        patient: existing?.patient,
        from_therapy_case: existing?.from_therapy_case,
      };
    } else {
      data = {
        transfer_reason: input.transfer_reason,
        therapist: input.therapist_id ? { id: input.therapist_id } : undefined,
        from_therapy_case: input.from_therapy_case_id
          ? { id: input.from_therapy_case_id }
          : undefined,
        status: TherapistTransferRequestStatus.PENDING,
      };
    }
    return Object.assign(new TherapistTransferRequest(), existing ?? {}, data);
  }

  public toCancelModel(
    existing: TherapistTransferRequest,
  ): TherapistTransferRequest {
    return Object.assign(new TherapistTransferRequest(), existing, {
      status: TherapistTransferRequestStatus.CANCELLED,
    });
  }

  public toOutput(
    input: TherapistTransferRequest,
  ): TherapistTransferRequestOutput {
    return Object.assign(new TherapistTransferRequestOutput(), {
      id: input.id,
      transfer_reason: input.transfer_reason,
      status: input.status,
      status_reason: input.status_reason,
      therapist: input.therapist
        ? this.therapistMapper.toOutput(input.therapist)
        : undefined,
      patient: input.patient
        ? this.patientMapper.toOutput(input.patient)
        : undefined,
      from_therapy_case: input.from_therapy_case
        ? this.therapyCaseMapper.toOutput(input.from_therapy_case)
        : undefined,
      therapist_id: input.therapistId,
      patient_id: input.patientId,
      from_therapy_case_id: input.from_therapy_caseId,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }

  private allowedStatusesForTherapist = [
    TherapistTransferRequestStatus.REJECTED,
    TherapistTransferRequestStatus.APPROVED,
  ];

  private allowedStatusesForPatient = [
    TherapistTransferRequestStatus.CANCELLED,
  ];
}
