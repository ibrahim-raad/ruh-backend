import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { DayOfWeek } from '../shared/day-of-week.enum';
import { TherapistOutput } from 'src/domain/therapists/dto/therapist.output';

export class TherapistAvailabilityOutput extends AuditableOutput {
  readonly day_of_week: DayOfWeek;
  readonly start_time: string;
  readonly end_time: string;
  readonly break_start_time: string;
  readonly break_end_time: string;
  readonly therapist_id?: string;
  readonly therapist: TherapistOutput;
}
