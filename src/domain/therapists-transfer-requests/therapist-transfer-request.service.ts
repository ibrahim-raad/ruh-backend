import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapistTransferRequest } from './entities/therapist-transfer-request.entity';
import { SearchTherapistTransferRequest } from './dto/search-therapist-transfer-request.dto';
import { TherapistTransferRequestAudit } from './entities/therapist-transfer-request.entity.audit';
import { TherapistService } from '../therapists/therapist.service';
import { PatientService } from '../patients/patient.service';
import { ClsService } from 'nestjs-cls';
import { User } from '../users/entities/user.entity';
import { SESSION_USER_KEY } from 'src/app.constants';
import { TherapyCaseService } from '../therapy-cases/therapy-case.service';
import { TherapistTransferRequestStatus } from './shared/therapist-transfer-request-status.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TherapistTransferRequestTopic } from './shared/therapist-transfer-request-topic.enum';

@Injectable()
export class TherapistTransferRequestService extends CrudService<
  TherapistTransferRequest,
  TherapistTransferRequestAudit
> {
  constructor(
    @InjectRepository(TherapistTransferRequest)
    protected readonly repository: Repository<TherapistTransferRequest>,
    @InjectRepository(TherapistTransferRequestAudit)
    protected readonly auditRepository: Repository<TherapistTransferRequestAudit>,
    private readonly therapistService: TherapistService,
    private readonly patientService: PatientService,
    private readonly therapyCaseService: TherapyCaseService,
    private readonly clsService: ClsService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(TherapistTransferRequest, repository, auditRepository, {
      therapist: {
        user: true,
      },
      patient: {
        user: true,
      },
      from_therapy_case: {
        therapist: {
          user: true,
        },
        patient: {
          user: true,
        },
        transferred_to: true,
      },
    });
  }

  public async create(
    input: TherapistTransferRequest,
  ): Promise<TherapistTransferRequest> {
    const user = this.getCurrentUser();
    const patient = await this.patientService.one({
      user: { id: user?.id },
    });
    const therapyCase = input.from_therapy_case?.id
      ? await this.therapyCaseService.one({
          id: input.from_therapy_case.id,
        })
      : undefined;
    if (therapyCase && therapyCase.therapistId === input.therapist.id) {
      throw new ConflictException(
        'You must select a different therapist or transfer from a different therapy case',
      );
    }
    const therapist = await this.therapistService.one({
      id: input.therapist.id,
    });
    const therapistTransferRequest = Object.assign(
      new TherapistTransferRequest(),
      {
        transfer_reason: input.transfer_reason,
        therapist: therapist,
        patient: patient,
        from_therapy_case: therapyCase,
      },
    );
    return this.repository.save(therapistTransferRequest);
  }

  public async update(
    old: TherapistTransferRequest,
    input: TherapistTransferRequest,
  ): Promise<TherapistTransferRequest> {
    const updated = await super.update(old, input);
    if (
      old.status !== input.status &&
      input.status === TherapistTransferRequestStatus.APPROVED
    ) {
      this.eventEmitter.emit(TherapistTransferRequestTopic.APPROVED, {
        data: updated,
      });
    }
    return updated;
  }

  public async find(
    criteria: SearchTherapistTransferRequest,
  ): Promise<TherapistTransferRequest[]> {
    const where = {
      ...(isDefined(criteria.transfer_reason) && {
        transfer_reason: ILike('%' + criteria.transfer_reason + '%'),
      }),
      ...(isDefined(criteria.statuses) && {
        status: In(criteria.statuses),
      }),
      ...(isDefined(criteria.therapist_id) && {
        therapist: { id: criteria.therapist_id },
      }),
      ...(isDefined(criteria.patient_id) && {
        patient: { id: criteria.patient_id },
      }),
      ...(isDefined(criteria.from_therapy_case_id) && {
        from_therapy_case: { id: criteria.from_therapy_case_id },
      }),
      ...(isDefined(criteria.to_therapy_case_id) && {
        from_therapy_case: {
          transferred_to: { id: criteria.to_therapy_case_id },
        },
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }

  private getCurrentUser(): User | undefined {
    return this.clsService.get<{ user?: User }>(SESSION_USER_KEY)?.user;
  }
}
