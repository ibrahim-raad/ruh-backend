import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { PaymentStatus } from '../shared/payment-status.enum';
import { PaymentPayoutStatus } from '../shared/payment-payout-status.enum';
import { SessionOutput } from 'src/domain/sessions/dto/session.output';
import { TherapistOutput } from 'src/domain/therapists/dto/therapist.output';
import { PatientOutput } from 'src/domain/patients/dto/patient.output';

export class PaymentOutput extends AuditableOutput {
  readonly amount: number;
  readonly net_amount: number;
  readonly platform_fee: number;
  readonly refunded_amount: number;
  readonly refunded_reason?: string;
  readonly status: PaymentStatus;
  readonly payout_status: PaymentPayoutStatus;
  readonly payout_date?: Date;
  readonly refunded_at?: Date;
  readonly session_id?: string;
  readonly therapist_id?: string;
  readonly patient_id?: string;
  readonly session: SessionOutput;
  readonly therapist: TherapistOutput;
  readonly patient: PatientOutput;
  readonly provider_payment_intent_id: string;
  readonly provider_transaction_id: string;
  readonly currency_code: string;
}
