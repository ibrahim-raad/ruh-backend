declare module 'luxon' {
  export interface ToISOOptions {
    suppressMilliseconds?: boolean;
  }

  export class DateTime {
    static now(): DateTime;
    static fromISO(iso: string, options?: ToISOOptions): DateTime;
    static fromJSDate(date: Date): DateTime;

    setZone(zone: string): DateTime;
    startOf(unit: 'day'): DateTime;
    endOf(unit: 'day'): DateTime;
    plus(duration: { days?: number; minutes?: number }): DateTime;
    toUTC(): DateTime;
    toJSDate(): Date;
    toISODate(): string | null;
    toISO(options?: ToISOOptions): string | null;
    set(values: {
      hour?: number;
      minute?: number;
      second?: number;
      millisecond?: number;
    }): DateTime;
    toMillis(): number;

    get weekday(): number;
  }
}
