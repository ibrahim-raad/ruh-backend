import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateTherapistCertificate } from './dto/create-therapist-certificate.dto';
import { TherapistCertificate } from './entities/therapist-certificate.entity';
import { UpdateTherapistCertificate } from './dto/update-therapist-certificate.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { TherapistCertificateOutput } from './dto/therapist-certificate.output';
import { SpecializationMapper } from '../specializations/specialization.mapper';
import { TherapistMapper } from '../therapists/therapist.mapper';

@Injectable()
export class TherapistCertificateMapper {
  constructor(
    private readonly specializationMapper: SpecializationMapper,
    private readonly therapistMapper: TherapistMapper,
  ) {}
  public toModel(input: CreateTherapistCertificate): TherapistCertificate;

  public toModel(
    input: UpdateTherapistCertificate,
    existing: TherapistCertificate,
  ): TherapistCertificate;

  public toModel(
    input: CreateTherapistCertificate | UpdateTherapistCertificate,
    existing?: TherapistCertificate,
  ): TherapistCertificate {
    let data = {};

    if (input instanceof UpdateTherapistCertificate) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        title: input.title ?? existing?.title,
        issuer: input.issuer ?? existing?.issuer,
        issued_date: input.issued_date ?? existing?.issued_date,
        description: input.description ?? existing?.description,
        specialization_id: input.specialization_id
          ? { id: input.specialization_id }
          : existing?.specialization,
        therapist: existing?.therapist,
      };
    } else {
      data = {
        title: input.title,
        issuer: input.issuer,
        issued_date: input.issued_date,
        description: input.description,
        specialization: input.specialization_id
          ? { id: input.specialization_id }
          : undefined,
      };
    }
    return Object.assign(new TherapistCertificate(), existing ?? {}, data);
  }

  public toOutput(input: TherapistCertificate): TherapistCertificateOutput {
    return Object.assign(new TherapistCertificateOutput(), {
      id: input.id,
      title: input.title,
      issuer: input.issuer,
      issued_date: input.issued_date,
      description: input.description,
      specialization: input.specialization
        ? this.specializationMapper.toOutput(input.specialization)
        : undefined,
      therapist: input.therapist
        ? this.therapistMapper.toOutput(input.therapist)
        : undefined,
      therapist_id: input.therapistId,
      specialization_id: input.specializationId,
      file_url: input.file_url,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
