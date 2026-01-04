import { IsNotEmpty, IsUUID } from 'class-validator';

export class TherapistAvailabilityCalendarQuery {
  @IsNotEmpty()
  @IsUUID()
  readonly therapist_id: string;
}
