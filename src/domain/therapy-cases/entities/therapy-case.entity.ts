import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Patient } from 'src/domain/patients/entities/patient.entity';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { Therapist } from 'src/domain/therapists/entities/therapist.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { TherapyCaseType } from '../shared/therapy-case-type.enum';
import { TherapyCaseStatus } from '../shared/therapy-case-status.enum';
import { Type } from 'class-transformer';

@Entity('therapy_cases')
@Index(['notes'])
@Index(['type'])
@Index(['status'])
@Index(['patient'])
@Index(['therapist'])
@Index(['transferred_to'])
@Index(['patient', 'type'], {
  unique: true,
  where: "status = 'ACTIVE' AND deleted_at IS NULL",
})
export class TherapyCase extends AbstractEntity {
  @ManyToOne(() => Patient, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @RelationId((therapyCase: TherapyCase) => therapyCase.patient)
  patientId: string;

  @ManyToOne(() => Therapist, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;

  @RelationId((therapyCase: TherapyCase) => therapyCase.therapist)
  therapistId: string;

  @ManyToOne(() => TherapyCase, {
    nullable: true,
    cascade: false,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'transferred_to_id' })
  transferred_to?: TherapyCase;

  @RelationId((therapyCase: TherapyCase) => therapyCase.transferred_to)
  transferred_to_id?: string;

  @IsOptional()
  @IsEnum(TherapyCaseType)
  @Column({
    nullable: false,
    type: 'enum',
    enum: TherapyCaseType,
    default: TherapyCaseType.THERAPIST,
  })
  type: TherapyCaseType = TherapyCaseType.THERAPIST;

  @IsOptional()
  @IsEnum(TherapyCaseStatus)
  @Column({
    nullable: false,
    type: 'enum',
    enum: TherapyCaseStatus,
    default: TherapyCaseStatus.ACTIVE,
  })
  status: TherapyCaseStatus = TherapyCaseStatus.ACTIVE;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamptz' })
  first_session_at?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamptz' })
  last_session_at?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Column({ nullable: false, type: 'integer', default: 0 })
  total_sessions: number = 0;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  notes?: string;
}
