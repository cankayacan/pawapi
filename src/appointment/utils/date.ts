import { MIN_BOOKING_NOTICE_IN_MINUTES } from './appointment-settings';

export const normalizeDate = (date: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    0,
    0,
  );
};

export const isAppointmentInBookableWindow = (
  appointmentDate: Date,
): boolean => {
  const now = new Date();
  const offsetMilliseconds = MIN_BOOKING_NOTICE_IN_MINUTES * 60 * 1000;
  const minFutureDate = new Date(now.getTime() + offsetMilliseconds);

  return appointmentDate >= minFutureDate;
};
