import { Locale } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { de } from 'date-fns/locale';

// Default timezone for the application
export const DEFAULT_TIMEZONE = 'Europe/Berlin';

/**
 * Format a date in the default timezone
 * @param date The date to format
 * @param formatStr The format string to use
 * @param options Additional options like locale
 * @returns The formatted date string
 */
export const formatInDefaultTimezone = (
  date: Date | number,
  formatStr: string,
  options?: { locale?: Locale },
): string => {
  return formatInTimeZone(date, DEFAULT_TIMEZONE, formatStr, options);
};

/**
 * Format a date in the default timezone with German locale
 * @param date The date to format
 * @param formatStr The format string to use
 * @returns The formatted date string in German locale
 */
export const formatInDefaultTimezoneWithGermanLocale = (
  date: Date | number,
  formatStr: string,
): string => {
  return formatInTimeZone(date, DEFAULT_TIMEZONE, formatStr, { locale: de });
};
