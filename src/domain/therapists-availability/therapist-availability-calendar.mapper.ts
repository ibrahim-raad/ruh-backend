import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import {
  TherapistAvailabilityCalendarDayOutput,
  TherapistAvailabilityCalendarOutput,
  TherapistAvailabilityCalendarRangeOutput,
  TherapistAvailabilityCalendarSlotOutput,
} from './dto/therapist-availability-calendar.output';
import { AvailabilityCalendarDayReason } from './dto/availability-calendar-day-reason.enum';
import { AvailabilityCalendarSlotReason } from './dto/availability-calendar-slot-reason.enum';

@Injectable()
export class TherapistAvailabilityCalendarMapper {
  public toRangeOutput(
    from: DateTime,
    to: DateTime,
  ): TherapistAvailabilityCalendarRangeOutput {
    return { from: from.toISODate()!, to: to.toISODate()! };
  }

  public toSlotOutput(input: {
    therapistId: string;
    start: DateTime;
    end: DateTime;
    bookable: boolean;
    reason?: AvailabilityCalendarSlotReason;
  }): TherapistAvailabilityCalendarSlotOutput {
    const startIso = input.start.toISO({ suppressMilliseconds: true })!;
    const endIso = input.end.toISO({ suppressMilliseconds: true })!;

    return {
      start: startIso,
      end: endIso,
      bookable: input.bookable,
      ...(input.reason && { reason: input.reason }),
      slotId: `slot_${input.therapistId}_${startIso}`,
    };
  }

  public toDayOutput(input: {
    date: string;
    available: boolean;
    reason?: AvailabilityCalendarDayReason;
    slots: TherapistAvailabilityCalendarSlotOutput[];
  }): TherapistAvailabilityCalendarDayOutput {
    return {
      date: input.date,
      available: input.available,
      ...(input.reason && { reason: input.reason }),
      slots: input.slots,
    };
  }

  public toCalendarOutput(input: {
    therapistId: string;
    timezone: string;
    range: TherapistAvailabilityCalendarRangeOutput;
    slotDurationMinutes: number;
    bookingLeadTimeMinutes: number;
    bookingHorizonDays: number;
    days: TherapistAvailabilityCalendarDayOutput[];
  }): TherapistAvailabilityCalendarOutput {
    return {
      therapistId: input.therapistId,
      timezone: input.timezone,
      range: input.range,
      slotDurationMinutes: input.slotDurationMinutes,
      bookingLeadTimeMinutes: input.bookingLeadTimeMinutes,
      bookingHorizonDays: input.bookingHorizonDays,
      days: input.days,
    };
  }
}
