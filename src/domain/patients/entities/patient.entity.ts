import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { User } from 'src/domain/users/entities/user.entity';
import { UserGender } from 'src/domain/users/shared/user-gender.enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { TherapyMode } from '../shared/therapy-mode.enum';

@Entity('patients')
@Index(['user'])
@Index(['preferred_therapist_gender'])
@Index(['preferred_therapy_mode'])
export class Patient extends AbstractEntity {
  @ManyToOne(() => User, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((patient: Patient) => patient.user)
  userId: string;

  @IsNotEmpty()
  @IsEnum(UserGender)
  @Column({
    nullable: false,
    type: 'enum',
    enum: UserGender,
    default: UserGender.UNKNOWN,
  })
  preferred_therapist_gender: UserGender = UserGender.UNKNOWN;

  @IsNotEmpty()
  @IsEnum(TherapyMode)
  @Column({
    nullable: false,
    type: 'enum',
    enum: TherapyMode,
    default: TherapyMode.BOTH,
  })
  preferred_therapy_mode: TherapyMode = TherapyMode.BOTH;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  provider_customer_id?: string;
}
