import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Patient } from 'src/domain/patients/entities/patient.entity';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { IsBooleanish } from 'src/domain/shared/decorators';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { ReflectionMood } from '../shared/reflection-mood.enum';

@Entity('reflections')
@Index(['name'])
export class Reflection extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, type: 'text' })
  content: string;

  @IsNotEmpty()
  @ManyToOne(() => Patient, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @RelationId((reflection: Reflection) => reflection.patient)
  patientId: string;

  @IsOptional()
  @IsBooleanish()
  @Column({ nullable: false, default: false, type: 'boolean' })
  is_private: boolean = false;

  @IsOptional()
  @IsEnum(ReflectionMood)
  @Column({
    nullable: false,
    type: 'enum',
    enum: ReflectionMood,
    default: ReflectionMood.NEUTRAL,
  })
  mood: ReflectionMood = ReflectionMood.NEUTRAL;
}
