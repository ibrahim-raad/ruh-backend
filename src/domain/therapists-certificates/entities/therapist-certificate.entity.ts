import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { Specialization } from 'src/domain/specializations/entities/specialization.entity';
import { Therapist } from 'src/domain/therapists/entities/therapist.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('therapists_certificates')
@Index(['file_url'])
export class TherapistCertificate extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  file_url: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  description?: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  issuer: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: false, type: 'timestamp' })
  issued_date: Date;

  @ManyToOne(() => Therapist, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;
  @RelationId(
    (therapistCertificate: TherapistCertificate) =>
      therapistCertificate.therapist,
  )
  therapistId: string;

  @ManyToOne(() => Specialization, {
    nullable: true,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'specialization_id' })
  specialization?: Specialization;
  @RelationId(
    (therapistCertificate: TherapistCertificate) =>
      therapistCertificate.specialization,
  )
  specializationId?: string;
}
