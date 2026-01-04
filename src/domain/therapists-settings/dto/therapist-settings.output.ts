import { AuditableOutput } from 'src/domain/shared/auditable.output';
import { TherapistOutput } from 'src/domain/therapists/dto/therapist.output';

export class TherapistSettingsOutput extends AuditableOutput {
  readonly therapist_id?: string;
  readonly therapist: TherapistOutput;
  readonly is_open: boolean;
  readonly booking_threshold_hours: number;
  readonly max_booking_days: number;
  readonly max_sessions_per_day: number;
  readonly session_duration_minutes: number;
  readonly buffer_minutes: number;
  readonly timezone: string;
}
