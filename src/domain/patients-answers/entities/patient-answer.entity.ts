import { IsOptional, IsString } from 'class-validator';
import { Patient } from 'src/domain/patients/entities/patient.entity';
import { PossibleAnswer } from 'src/domain/possible-answers/entities/possible-answer.entity';
import { Question } from 'src/domain/questions/entities/question.entity';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('patients_answers')
@Index(['question'])
@Index(['possible_answer'])
@Index(['patient'])
@Index(['question', 'possible_answer', 'patient'])
export class PatientAnswer extends AbstractEntity {
  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  answer?: string;

  @ManyToOne(() => Question, {
    nullable: false,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @RelationId((possibleAnswer: PossibleAnswer) => possibleAnswer.question)
  questionId?: string;

  @ManyToOne(() => PossibleAnswer, {
    nullable: true,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({ name: 'possible_answer_id' })
  possible_answer?: PossibleAnswer;

  @RelationId((patientAnswer: PatientAnswer) => patientAnswer.possible_answer)
  possibleAnswerId?: string;

  @ManyToOne(() => Patient, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @RelationId((patientAnswer: PatientAnswer) => patientAnswer.patient)
  patientId: string;
}
