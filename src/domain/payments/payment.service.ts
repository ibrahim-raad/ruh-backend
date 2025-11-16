import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Payment } from './entities/payment.entity';
import { SearchPayment } from './dto/search-payment.dto';
import { PaymentAudit } from './entities/payment.entity.audit';
import { SessionService } from '../sessions/session.service';
import { TherapistService } from '../therapists/therapist.service';
import { PatientService } from '../patients/patient.service';

@Injectable()
export class PaymentService extends CrudService<Payment, PaymentAudit> {
  constructor(
    @InjectRepository(Payment)
    protected readonly repository: Repository<Payment>,
    @InjectRepository(PaymentAudit)
    protected readonly auditRepository: Repository<PaymentAudit>,
    private readonly sessionService: SessionService,
    private readonly therapistService: TherapistService,
    private readonly patientService: PatientService,
  ) {
    super(Payment, repository, auditRepository, {
      session: {
        therapy_case: true,
      },
      therapist: {
        user: {
          country: true,
        },
      },
      patient: {
        user: {
          country: true,
        },
      },
    });
  }

  public async create(input: Payment): Promise<Payment> {
    const session = await this.sessionService.one({ id: input.session.id });
    const therapist = await this.therapistService.one({
      id: input.therapist.id,
    });
    const patient = await this.patientService.one({ id: input.patient.id });
    const entity = Object.assign(new Payment(), input, {
      session,
      therapist,
      patient,
    });
    return super.create(entity);
  }

  public async find(criteria: SearchPayment): Promise<Payment[]> {
    const where = {
      ...(isDefined(criteria.provider_payment_intent_id) && {
        provider_payment_intent_id: criteria.provider_payment_intent_id,
      }),
      ...(isDefined(criteria.provider_transaction_id) && {
        provider_transaction_id: criteria.provider_transaction_id,
      }),
      ...(isDefined(criteria.currency_code) && {
        currency_code: ILike('%' + criteria.currency_code + '%'),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
