import { IsNumber, IsOptional, IsTimeZone, Max, Min } from 'class-validator';
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

@Entity('therapists_settings')
@Index(['timezone'])
@Index(['therapist'], { unique: true })
@Index(['is_open'])
export class TherapistSettings extends AbstractEntity {
  @ManyToOne(() => Therapist, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;
  @RelationId((ts: TherapistSettings) => ts.therapist)
  therapistId: string;

  @IsOptional()
  @IsBooleanish()
  @Column({ nullable: false, default: false, type: 'boolean' })
  is_open: boolean = false; // if true, the schedule is open for anytime booking

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Column({ nullable: false, type: 'integer', default: 24 })
  booking_threshold_hours: number = 24; // the number of hours before the appointment time that the patient can book the appointment

  @IsOptional()
  @IsNumber()
  @Min(7)
  @Column({ nullable: false, type: 'integer', default: 30 })
  max_booking_days: number = 30; // the maximum number of days in advance that the patient can book the appointment

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(8)
  @Column({ nullable: false, type: 'integer', default: 8 })
  max_sessions_per_day: number = 8; // the maximum number of sessions per day that the therapist can have

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(120)
  @Column({ nullable: false, type: 'integer', default: 60 })
  session_duration_minutes: number = 60; // the duration of the session in minutes

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(60)
  @Column({ nullable: false, type: 'integer', default: 10 })
  buffer_minutes: number = 10; // minutes between sessions (slot step = session_duration + buffer)

  @IsOptional()
  @IsTimeZone() // IANA timezone
  @Column({ nullable: false, length: 255, default: 'UTC' })
  timezone: string = 'UTC'; // the timezone of the therapist
}
