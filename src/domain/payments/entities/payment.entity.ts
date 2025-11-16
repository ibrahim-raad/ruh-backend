import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { PaymentStatus } from '../shared/payment-status.enum';
import { PaymentPayoutStatus } from '../shared/payment-payout-status.enum';
import { Type } from 'class-transformer';
import { Session } from 'src/domain/sessions/entities/session.entity';
import { Therapist } from 'src/domain/therapists/entities/therapist.entity';
import { Patient } from 'src/domain/patients/entities/patient.entity';

@Entity('payments')
@Index(['provider_payment_intent_id'])
@Index(['provider_transaction_id'])
@Index(['currency_code'])
@Index(['amount'])
@Index(['net_amount'])
@Index(['platform_fee'])
@Index(['refunded_amount'])
@Index(['refunded_reason'])
@Index(['status'])
@Index(['payout_status'])
@Index(['payout_date'])
@Index(['refunded_at'])
@Index(['session'])
@Index(['therapist'])
@Index(['patient'])
export class Payment extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  provider_payment_intent_id: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  provider_transaction_id: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 3 })
  currency_code: string;

  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  net_amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  platform_fee: number;

  @IsOptional()
  @IsNumber()
  @Column({
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  refunded_amount: number = 0;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  refunded_reason?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  @Column({
    nullable: false,
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus = PaymentStatus.PENDING;

  @IsOptional()
  @IsEnum(PaymentPayoutStatus)
  @Column({
    nullable: false,
    type: 'enum',
    enum: PaymentPayoutStatus,
    default: PaymentPayoutStatus.HELD,
  })
  payout_status: PaymentPayoutStatus = PaymentPayoutStatus.HELD;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamp' })
  payout_date?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamp' })
  refunded_at?: Date;

  @ManyToOne(() => Session, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;
  @RelationId((payment: Payment) => payment.session)
  sessionId: string;

  @ManyToOne(() => Therapist, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;
  @RelationId((payment: Payment) => payment.therapist)
  therapistId: string;

  @ManyToOne(() => Patient, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
  @RelationId((payment: Payment) => payment.patient)
  patientId: string;
}
