import type { LocalDateTime } from '../types/quiz';

const localDateTimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

/** Parses a datetime-local value without converting it to UTC. */
export function parseLocalDateTime(value: string): Date | null {
  const match = localDateTimePattern.exec(value);

  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day) ||
    date.getHours() !== Number(hour) ||
    date.getMinutes() !== Number(minute)
  ) {
    return null;
  }

  return date;
}

export function isValidLocalDateTime(value: string): boolean {
  return parseLocalDateTime(value) !== null;
}

export function isFutureLocalDateTime(value: string, now = new Date()): boolean {
  const date = parseLocalDateTime(value);

  return date !== null && date.getTime() > now.getTime();
}

function dayPeriod(hour: number): string {
  if (hour < 5) return 'notte';
  if (hour < 12) return 'mattina';
  if (hour < 18) return 'pomeriggio';
  return 'sera';
}

/** Gives each selected slot a short, readable Italian context label. */
export function formatAvailabilityContext(value: LocalDateTime): string {
  const date = parseLocalDateTime(value);

  if (!date) return '';

  const dateLabel = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);

  return `${dateLabel} · ${dayPeriod(date.getHours())}`;
}
