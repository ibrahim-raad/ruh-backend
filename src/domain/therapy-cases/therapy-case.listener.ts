import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TherapistTransferRequestTopic } from '../therapists-transfer-requests/shared/therapist-transfer-request-topic.enum';
import { TherapistTransferRequest } from '../therapists-transfer-requests/entities/therapist-transfer-request.entity';
import { EntityEvent } from '../shared/entity.event';
import { TherapyCase } from './entities/therapy-case.entity';
import { TherapyCaseType } from './shared/therapy-case-type.enum';
import { TherapyCaseStatus } from './shared/therapy-case-status.enum';
import { TherapistService } from '../therapists/therapist.service';
import { PatientService } from '../patients/patient.service';
import { isDefined } from 'class-validator';
import { DataSource } from 'typeorm';

@Injectable()
export class TherapyCaseListener {
  constructor(
    private readonly therapistService: TherapistService,
    private readonly patientService: PatientService,
    private readonly dataSource: DataSource,
  ) {}

  @OnEvent(TherapistTransferRequestTopic.APPROVED)
  async handleTherapistTransferRequestApproved(
    payload: EntityEvent<TherapistTransferRequest>,
  ) {
    const { data: request } = payload;

    const therapist = await this.therapistService.one({
      id: request.therapistId,
    });
    const patient = await this.patientService.one({
      id: request.patientId,
    });
    const openCase = Object.assign(new TherapyCase(), {
      therapist: therapist,
      patient: patient,
      type: therapist.is_psychiatrist
        ? TherapyCaseType.PSYCHIATRIST
        : TherapyCaseType.THERAPIST,
    });
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const therapyCaseRepository =
        transactionalEntityManager.getRepository(TherapyCase);
      const created = therapyCaseRepository.create(openCase);
      const savedCreated = await therapyCaseRepository.save(created);
      if (isDefined(request.from_therapy_caseId)) {
        const fromCase = await therapyCaseRepository.findOneBy({
          id: request.from_therapy_caseId,
        });
        const updatedCase = Object.assign(new TherapyCase(), fromCase, {
          transferred_to: savedCreated,
          status: TherapyCaseStatus.TRANSFERRED,
        });
        await therapyCaseRepository.save(updatedCase);
      }
    });
  }
}
