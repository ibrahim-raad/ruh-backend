import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { TherapistTransferRequestStatus } from '../shared/therapist-transfer-request-status.enum';
import { Therapist } from 'src/domain/therapists/entities/therapist.entity';
import { Patient } from 'src/domain/patients/entities/patient.entity';
import { TherapyCase } from 'src/domain/therapy-cases/entities/therapy-case.entity';

@Entity('therapists_transfer_requests')
@Index(['transfer_reason'])
@Index(['status'])
@Index(['therapist'])
@Index(['patient'])
@Index(['from_therapy_case'])
@Index(['therapist', 'patient', 'from_therapy_case'], {
  unique: true,
  where: "status = 'PENDING' AND deleted_at IS NULL",
})
export class TherapistTransferRequest extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, type: 'text' })
  transfer_reason: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, type: 'text' })
  status_reason?: string;

  @IsOptional()
  @IsEnum(TherapistTransferRequestStatus)
  @Column({
    nullable: false,
    type: 'enum',
    enum: TherapistTransferRequestStatus,
    default: TherapistTransferRequestStatus.PENDING,
  })
  status: TherapistTransferRequestStatus =
    TherapistTransferRequestStatus.PENDING;

  @ManyToOne(() => Therapist, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;
  @RelationId(
    (therapistTransferRequest: TherapistTransferRequest) =>
      therapistTransferRequest.therapist,
  )
  therapistId: string;

  @ManyToOne(() => Patient, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
  @RelationId(
    (therapistTransferRequest: TherapistTransferRequest) =>
      therapistTransferRequest.patient,
  )
  patientId: string;

  @ManyToOne(() => TherapyCase, {
    nullable: true,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'from_therapy_case_id' })
  from_therapy_case?: TherapyCase;
  @RelationId(
    (therapistTransferRequest: TherapistTransferRequest) =>
      therapistTransferRequest.from_therapy_case,
  )
  from_therapy_caseId?: string;
}
