import { Injectable } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { PaymentOutput } from './dto/payment.output';
import { SessionMapper } from '../sessions/session.mapper';
import { TherapistMapper } from '../therapists/therapist.mapper';
import { PatientMapper } from '../patients/patient.mapper';

@Injectable()
export class PaymentMapper {
  constructor(
    private readonly sessionMapper: SessionMapper,
    private readonly therapistMapper: TherapistMapper,
    private readonly patientMapper: PatientMapper,
  ) {}
  public toOutput(input: Payment): PaymentOutput {
    return Object.assign(new PaymentOutput(), {
      id: input.id,
      amount: input.amount,
      net_amount: input.net_amount,
      platform_fee: input.platform_fee,
      refunded_amount: input.refunded_amount,
      refunded_reason: input.refunded_reason,
      status: input.status,
      payout_status: input.payout_status,
      payout_date: input.payout_date,
      refunded_at: input.refunded_at,
      session_id: input.sessionId,
      therapist_id: input.therapistId,
      patient_id: input.patientId,
      session: input.session
        ? this.sessionMapper.toOutput(input.session)
        : undefined,
      therapist: input.therapist
        ? this.therapistMapper.toOutput(input.therapist)
        : undefined,
      patient: input.patient
        ? this.patientMapper.toOutput(input.patient)
        : undefined,
      provider_payment_intent_id: input.provider_payment_intent_id,
      provider_transaction_id: input.provider_transaction_id,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
