import {
  IsBoolean,
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
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
import { DayOfWeek } from '../shared/day-of-week.enum';
import { Therapist } from 'src/domain/therapists/entities/therapist.entity';

@Entity('therapists_availability')
@Index(['therapist', 'day_of_week'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
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
  @IsMilitaryTime()
  @Column({ nullable: false, length: 5, default: '12:00' })
  break_start_time: string = '12:00'; // HH:MM format

  @IsOptional()
  @IsString()
  @IsMilitaryTime()
  @Column({ nullable: false, length: 5, default: '13:00' })
  break_end_time: string = '13:00'; // HH:MM format

  @IsOptional()
  @IsBoolean()
  @Column({ nullable: false, default: true })
  is_active: boolean = true;
}
