import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { ReflectionMood } from '../shared/reflection-mood.enum';
import { PatientOutput } from 'src/domain/patients/dto/patient.output';

export class ReflectionOutput extends AuditableOutput {
  readonly title: string;
  readonly content: string;
  readonly is_private: boolean;
  readonly mood: ReflectionMood;
  readonly patient: PatientOutput;
  readonly patient_id?: string;
}
