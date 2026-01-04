import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { TherapistAvailability } from './entities/therapist-availability.entity';
import { SearchTherapistAvailability } from './dto/search-therapist-availability.dto';
import { TherapistAvailabilityAudit } from './entities/therapist-availability.entity.audit';
import { FindOutputDto } from '../shared/dto/find-output,dto';
import { TherapistSettingsService } from '../therapists-settings/therapist-settings.service';
import { SessionStatus } from '../sessions/shared/session-status.enum';
import { TherapistAvailabilityCalendarQuery } from './dto/therapist-availability-calendar.query';
import {
  TherapistAvailabilityCalendarDayOutput,
  TherapistAvailabilityCalendarOutput,
  TherapistAvailabilityCalendarRangeOutput,
  TherapistAvailabilityCalendarSlotOutput,
} from './dto/therapist-availability-calendar.output';
import { AvailabilityCalendarDayReason } from './dto/availability-calendar-day-reason.enum';
import { AvailabilityCalendarSlotReason } from './dto/availability-calendar-slot-reason.enum';
import { DayOfWeek } from './shared/day-of-week.enum';
import { TherapistExceptionService } from '../therapists-exceptions/therapist-exception.service';
import { TherapistException } from '../therapists-exceptions/entities/therapist-exception.entity';
import { SessionService } from '../sessions/session.service';
import { Session } from '../sessions/entities/session.entity';
import { TherapistAvailabilityCalendarMapper } from './therapist-availability-calendar.mapper';

@Injectable()
export class TherapistAvailabilityService extends CrudService<
  TherapistAvailability,
  TherapistAvailabilityAudit
> {
  constructor(
    @InjectRepository(TherapistAvailability)
    protected readonly repository: Repository<TherapistAvailability>,
    @InjectRepository(TherapistAvailabilityAudit)
    protected readonly auditRepository: Repository<TherapistAvailabilityAudit>,
    private readonly therapistSettingsService: TherapistSettingsService,
    private readonly therapistExceptionService: TherapistExceptionService,
    private readonly sessionService: SessionService,
    private readonly calendarMapper: TherapistAvailabilityCalendarMapper,
  ) {
    super(TherapistAvailability, repository, auditRepository, {
      therapist: {
        user: true,
      },
    });
  }

  public async find(
    criteria: SearchTherapistAvailability,
  ): Promise<FindOutputDto<TherapistAvailability>> {
    const where = {
      ...(isDefined(criteria.days_of_week) && {
        day_of_week: In(criteria.days_of_week),
      }),
      ...(isDefined(criteria.therapist_id) && {
        therapist: { id: criteria.therapist_id },
      }),
      ...(isDefined(criteria.is_active) && { is_active: criteria.is_active }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }

  public async getCalendar(
    query: TherapistAvailabilityCalendarQuery,
  ): Promise<TherapistAvailabilityCalendarOutput> {
    const therapistId = query.therapist_id;

    const settings = await this.therapistSettingsService.one({
      therapist: { id: therapistId },
    });

    const timezone = settings.timezone;
    const today = DateTime.now().setZone(timezone).startOf('day');

    // Inclusive range of max_booking_days days: e.g. max=30 => today..today+29
    const rangeFrom = today;
    const rangeTo = today.plus({ days: settings.max_booking_days - 1 });

    const rangeStart = rangeFrom.startOf('day').toUTC().toJSDate();
    const rangeEnd = rangeTo.endOf('day').toUTC().toJSDate();

    const weekly = await this.repository.find({
      where: {
        therapist: { id: therapistId },
        deleted_at: IsNull(),
      },
    });
    const weeklyByDay = new Map<DayOfWeek, TherapistAvailability>();
    for (const w of weekly) weeklyByDay.set(w.day_of_week, w);

    const exceptions =
      await this.therapistExceptionService.findTherapistExceptionsInRange(
        therapistId,
        rangeStart,
        rangeEnd,
      );
    const exceptionsByDate = new Map<string, TherapistException>();
    for (const ex of exceptions) {
      const exDate = DateTime.fromJSDate(ex.date).setZone(timezone).toISODate();
      if (!exDate) continue;
      // keep only exceptions in range
      if (exDate >= rangeFrom.toISODate()! && exDate <= rangeTo.toISODate()!) {
        exceptionsByDate.set(exDate, ex);
      }
    }

    const blockingStatuses: SessionStatus[] = [
      SessionStatus.PENDING,
      SessionStatus.CONFIRMED,
      SessionStatus.RESCHEDULED,
    ];
    const sessions =
      await this.sessionService.findBlockingTherapistSessionsInRange(
        therapistId,
        rangeStart,
        rangeEnd,
        blockingStatuses,
      );

    const sessionsByDate = new Map<
      string,
      { start: DateTime; end: DateTime }[]
    >();
    for (const s of sessions) {
      const start = DateTime.fromJSDate(s.start_time).setZone(timezone);
      const end = DateTime.fromJSDate(s.end_time).setZone(timezone);
      const key = start.toISODate();
      if (!key) continue;
      const list = sessionsByDate.get(key) ?? [];
      list.push({ start, end });
      sessionsByDate.set(key, list);
    }

    const now = DateTime.now().setZone(timezone);
    const leadTimeMinutes = settings.booking_threshold_hours * 60;
    const durationMinutes = settings.session_duration_minutes;
    const stepMinutes = durationMinutes + settings.buffer_minutes;

    const days: TherapistAvailabilityCalendarDayOutput[] = [];
    for (
      let d = rangeFrom;
      d.toMillis() <= rangeTo.toMillis();
      d = d.plus({ days: 1 }).startOf('day')
    ) {
      const dateStr = d.toISODate()!;
      const exception = exceptionsByDate.get(dateStr);

      const daySessions = sessionsByDate.get(dateStr) ?? [];
      const maxedOut =
        daySessions.length >= (settings.max_sessions_per_day ?? 0);

      let windowStart: DateTime | undefined;
      let windowEnd: DateTime | undefined;
      let breakStart: DateTime | undefined;
      let breakEnd: DateTime | undefined;

      if (exception) {
        if (!exception.is_available) {
          days.push({
            date: dateStr,
            available: false,
            reason: AvailabilityCalendarDayReason.THERAPIST_EXCEPTION_DAY_OFF,
            slots: [],
          });
          continue;
        }

        const [sh, sm] = exception.start_time
          .split(':')
          .map((x) => parseInt(x));
        const [eh, em] = exception.end_time.split(':').map((x) => parseInt(x));
        windowStart = d.set({
          hour: sh,
          minute: sm,
          second: 0,
          millisecond: 0,
        });
        windowEnd = d.set({
          hour: eh,
          minute: em,
          second: 0,
          millisecond: 0,
        });

        // keep break from weekly availability, if present, since exceptions do not model breaks
        const weeklyRow = weeklyByDay.get(this.toDayOfWeek(d.weekday));
        if (weeklyRow) {
          const [bsh, bsm] = weeklyRow.break_start_time
            .split(':')
            .map((x) => parseInt(x));
          const [beh, bem] = weeklyRow.break_end_time
            .split(':')
            .map((x) => parseInt(x));
          breakStart = d.set({
            hour: bsh,
            minute: bsm,
            second: 0,
            millisecond: 0,
          });
          breakEnd = d.set({
            hour: beh,
            minute: bem,
            second: 0,
            millisecond: 0,
          });
        }
      } else {
        const weeklyRow = weeklyByDay.get(this.toDayOfWeek(d.weekday));
        if (!weeklyRow || !weeklyRow.is_active) {
          days.push({
            date: dateStr,
            available: false,
            reason: AvailabilityCalendarDayReason.THERAPIST_INACTIVE,
            slots: [],
          });
          continue;
        }

        const [sh, sm] = weeklyRow.start_time
          .split(':')
          .map((x) => parseInt(x));
        const [eh, em] = weeklyRow.end_time.split(':').map((x) => parseInt(x));
        windowStart = d.set({
          hour: sh,
          minute: sm,
          second: 0,
          millisecond: 0,
        });
        windowEnd = d.set({
          hour: eh,
          minute: em,
          second: 0,
          millisecond: 0,
        });

        const [bsh, bsm] = weeklyRow.break_start_time
          .split(':')
          .map((x) => parseInt(x));
        const [beh, bem] = weeklyRow.break_end_time
          .split(':')
          .map((x) => parseInt(x));
        breakStart = d.set({
          hour: bsh,
          minute: bsm,
          second: 0,
          millisecond: 0,
        });
        breakEnd = d.set({
          hour: beh,
          minute: bem,
          second: 0,
          millisecond: 0,
        });
      }

      const slots: TherapistAvailabilityCalendarSlotOutput[] = [];
      if (
        !windowStart ||
        !windowEnd ||
        windowEnd.toMillis() <= windowStart.toMillis()
      ) {
        days.push({
          date: dateStr,
          available: false,
          reason: AvailabilityCalendarDayReason.THERAPIST_INACTIVE,
          slots: [],
        });
        continue;
      }

      for (
        let slotStart = windowStart;
        slotStart.plus({ minutes: durationMinutes }).toMillis() <=
        windowEnd.toMillis();
        slotStart = slotStart.plus({ minutes: stepMinutes })
      ) {
        const slotEnd = slotStart.plus({ minutes: durationMinutes });

        if (breakStart && breakEnd) {
          const overlapsBreak =
            slotStart.toMillis() < breakEnd.toMillis() &&
            slotEnd.toMillis() > breakStart.toMillis();
          if (overlapsBreak) continue;
        }

        let bookable = true;
        let reason: AvailabilityCalendarSlotReason | undefined;

        if (!settings.is_open) {
          const threshold = now.plus({ minutes: leadTimeMinutes });
          if (slotStart.toMillis() < threshold.toMillis()) {
            bookable = false;
            reason = AvailabilityCalendarSlotReason.BOOKING_THRESHOLD;
          }
        }

        if (bookable && maxedOut) {
          bookable = false;
          reason = AvailabilityCalendarSlotReason.MAX_SESSIONS_PER_DAY;
        }

        if (bookable && daySessions.length) {
          const overlapsSession = daySessions.some(
            (s) =>
              slotStart.toMillis() < s.end.toMillis() &&
              slotEnd.toMillis() > s.start.toMillis(),
          );
          if (overlapsSession) {
            bookable = false;
            reason = AvailabilityCalendarSlotReason.BOOKED;
          }
        }

        slots.push(
          this.calendarMapper.toSlotOutput({
            therapistId,
            start: slotStart,
            end: slotEnd,
            bookable,
            ...(reason && { reason }),
          }),
        );
      }

      days.push(
        this.calendarMapper.toDayOutput({
          date: dateStr,
          available: true,
          slots,
        }),
      );
    }

    const range: TherapistAvailabilityCalendarRangeOutput =
      this.calendarMapper.toRangeOutput(rangeFrom, rangeTo);

    return this.calendarMapper.toCalendarOutput({
      therapistId,
      timezone,
      range,
      slotDurationMinutes: durationMinutes,
      bookingLeadTimeMinutes: leadTimeMinutes,
      bookingHorizonDays: settings.max_booking_days,
      days,
    });
  }

  private toDayOfWeek(weekday: number): DayOfWeek {
    // Luxon: Monday=1 ... Sunday=7
    switch (weekday) {
      case 1:
        return DayOfWeek.MONDAY;
      case 2:
        return DayOfWeek.TUESDAY;
      case 3:
        return DayOfWeek.WEDNESDAY;
      case 4:
        return DayOfWeek.THURSDAY;
      case 5:
        return DayOfWeek.FRIDAY;
      case 6:
        return DayOfWeek.SATURDAY;
      case 7:
      default:
        return DayOfWeek.SUNDAY;
    }
  }
}
