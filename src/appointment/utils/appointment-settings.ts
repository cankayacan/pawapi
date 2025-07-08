import { DayOfWeek } from '../types/day-of-week';

export const APPOINTMENT_WINDOW_IN_DAYS = 21;
export const TIME_SLOT_INTERVAL = 60;
export const CONFLICT_WINDOW_IN_MINUTES = 10;
export const MIN_BOOKING_NOTICE_IN_MINUTES = 60;

export interface TimeRange {
  startTime: number;
  endTime: number;
}

export const WORK_HOURS: { [key in DayOfWeek]: TimeRange[] } = {
  [DayOfWeek.MONDAY]: [{ startTime: 8, endTime: 23 }],
  [DayOfWeek.TUESDAY]: [
    { startTime: 8, endTime: 12 },
    { startTime: 19, endTime: 23 },
  ],
  [DayOfWeek.WEDNESDAY]: [
    { startTime: 8, endTime: 12 },
    { startTime: 19, endTime: 23 },
  ],
  [DayOfWeek.THURSDAY]: [
    { startTime: 8, endTime: 12 },
    { startTime: 19, endTime: 23 },
  ],
  [DayOfWeek.FRIDAY]: [{ startTime: 19, endTime: 23 }],
  [DayOfWeek.SATURDAY]: [{ startTime: 8, endTime: 22 }],
  [DayOfWeek.SUNDAY]: [{ startTime: 8, endTime: 22 }],
};
