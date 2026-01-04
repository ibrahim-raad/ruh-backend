import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Currency } from 'src/domain/currencies/entities/currency.entity';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { ToNumber } from 'src/domain/shared/decorators/to-number.decorator';
import { User } from 'src/domain/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { PayoutMethodStatus } from '../shared/payout-status.enum';
import { TherapistSpecialization } from 'src/domain/therapists-specializations/entities/therapist-specialization.entity';
import { TherapistCertificate } from 'src/domain/therapists-certificates/entities/therapist-certificate.entity';

@Entity('therapists')
@Index(['user'], { unique: true })
export class Therapist extends AbstractEntity {
  @IsNotEmpty()
  @ManyToOne(() => User, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((therapist: Therapist) => therapist.user)
  userId: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  years_of_experience?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Column({ nullable: true, type: 'integer' })
  rate_per_hour?: number;

  @IsOptional()
  @ManyToOne(() => Currency, {
    nullable: true,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'currency_id' })
  currency?: Currency;

  @RelationId((therapist: Therapist) => therapist.currency)
  currencyId?: string;

  @IsOptional()
  @IsBooleanish()
  @Column({ nullable: false, default: false, type: 'boolean' })
  is_psychiatrist: boolean = false;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  license_number?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamp' })
  license_expiration_date?: Date;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  payment_provider_account_id?: string;

  @IsOptional()
  @IsEnum(PayoutMethodStatus)
  @Column({
    nullable: false,
    type: 'enum',
    enum: PayoutMethodStatus,
    default: PayoutMethodStatus.UNVERIFIED,
  })
  payout_method_status: PayoutMethodStatus = PayoutMethodStatus.UNVERIFIED;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Column({ nullable: false, type: 'decimal', default: 0 })
  balance_collected?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Column({ nullable: false, type: 'decimal', default: 0 })
  balance_available?: number;

  @OneToMany(
    () => TherapistSpecialization,
    (therapistSpecialization) => therapistSpecialization.therapist,
  )
  therapistSpecializations?: TherapistSpecialization[];

  @OneToMany(
    () => TherapistCertificate,
    (therapistCertificate) => therapistCertificate.therapist,
  )
  therapistCertificates?: TherapistCertificate[];
}
