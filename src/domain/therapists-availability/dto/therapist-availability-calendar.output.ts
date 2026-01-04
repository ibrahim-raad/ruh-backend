import { AvailabilityCalendarDayReason } from './availability-calendar-day-reason.enum';
import { AvailabilityCalendarSlotReason } from './availability-calendar-slot-reason.enum';

export class TherapistAvailabilityCalendarRangeOutput {
  readonly from: string; // YYYY-MM-DD in therapist timezone
  readonly to: string; // YYYY-MM-DD in therapist timezone
}

export class TherapistAvailabilityCalendarSlotOutput {
  readonly start: string; // ISO datetime with offset, e.g. 2026-01-06T09:00:00+02:00
  readonly end: string; // ISO datetime with offset
  readonly bookable: boolean;
  readonly reason?: AvailabilityCalendarSlotReason;
  readonly slotId?: string;
}

export class TherapistAvailabilityCalendarDayOutput {
  readonly date: string; // YYYY-MM-DD in therapist timezone
  readonly available: boolean;
  readonly reason?: AvailabilityCalendarDayReason;
  readonly slots: TherapistAvailabilityCalendarSlotOutput[];
}

export class TherapistAvailabilityCalendarOutput {
  readonly therapistId: string;
  readonly timezone: string;
  readonly range: TherapistAvailabilityCalendarRangeOutput;
  readonly slotDurationMinutes: number;
  readonly bookingLeadTimeMinutes: number;
  readonly bookingHorizonDays: number;
  readonly days: TherapistAvailabilityCalendarDayOutput[];
}
