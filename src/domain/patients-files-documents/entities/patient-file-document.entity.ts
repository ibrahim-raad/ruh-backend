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
import { PatientFileDocumentType } from '../shared/patient-file-document-type.enum';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { TherapyCase } from 'src/domain/therapy-cases/entities/therapy-case.entity';

@Entity('patients_files_documents')
@Index(['file_url'])
@Index(['therapy_case'])
@Index(['type'])
@Index(['is_uploaded_by_patient'])
export class PatientFileDocument extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  file_url: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  description?: string;

  @IsNotEmpty()
  @IsEnum(PatientFileDocumentType)
  @Column({ nullable: false, type: 'enum', enum: PatientFileDocumentType })
  type: PatientFileDocumentType;

  @IsOptional()
  @IsBooleanish()
  @Column({ nullable: false, default: true, type: 'boolean' })
  is_uploaded_by_patient: boolean = true;

  @ManyToOne(() => TherapyCase, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapy_case_id' })
  therapy_case: TherapyCase;
  @RelationId(
    (patientFileDocument: PatientFileDocument) =>
      patientFileDocument.therapy_case,
  )
  therapyCaseId: string;
}
