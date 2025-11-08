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

@Entity('therapists_specializations')
@Index(['therapist', 'specialization'], { unique: true })
@Index(['therapist'])
@Index(['specialization'])
export class TherapistSpecialization extends AbstractEntity {
  @ManyToOne(() => Therapist, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'therapist_id' })
  therapist: Therapist;
  @RelationId((ts: TherapistSpecialization) => ts.therapist)
  therapistId: string;

  @ManyToOne(() => Specialization, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'specialization_id' })
  specialization: Specialization;
  @RelationId((ts: TherapistSpecialization) => ts.specialization)
  specializationId: string;
}
