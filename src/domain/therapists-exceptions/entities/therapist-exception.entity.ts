import { Type } from 'class-transformer';
import {
  IsDate,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { Therapist } from 'src/domain/therapists/entities/therapist.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('therapists_exceptions')
@Index(['therapist'])
@Index(['date'])
@Index(['therapist', 'date'], { unique: true, where: 'deleted_at IS NULL' })
export class TherapistException extends AbstractEntity {
  @IsNotEmpty()
  @ManyToOne(() => Therapist, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;
  @RelationId((te: TherapistException) => te.therapist)
  therapistId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: false, type: 'timestamptz' })
  date: Date;

  @IsOptional()
  @IsBooleanish()
  @Column({ nullable: false, default: false, type: 'boolean' })
  is_available: boolean = true;

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  @Column({ nullable: false, length: 5, default: '09:00' })
  start_time: string = '09:00'; // HH:MM format

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  @Column({ nullable: false, length: 5, default: '17:00' })
  end_time: string = '17:00'; // HH:MM format

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  reason?: string;
}
