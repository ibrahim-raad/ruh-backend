import { IsEnum, IsMilitaryTime, IsNotEmpty, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { DayOfWeek } from '../shared/day-of-week.enum';
import { Therapist } from 'src/domain/therapists/entities/therapist.entity';

@Entity('therapists_availability')
@Index(['therapist', 'day_of_week'])
export class TherapistAvailability extends AbstractEntity {
  @ManyToOne(() => Therapist, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;
  @RelationId((ta: TherapistAvailability) => ta.therapist)
  therapistId: string;

  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  @Column({ nullable: false, type: 'enum', enum: DayOfWeek })
  day_of_week: DayOfWeek;

  @IsNotEmpty()
  @IsString()
  @IsMilitaryTime()
  @Column({ nullable: false, length: 5 })
  start_time: string; // HH:MM format

  @IsNotEmpty()
  @IsString()
  @IsMilitaryTime()
  @Column({ nullable: false, length: 5 })
  end_time: string; // HH:MM format
}
