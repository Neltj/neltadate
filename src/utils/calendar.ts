import type { LocalDateTime } from '../types/quiz';

export interface CalendarExportInput {
  readonly dateTimes: readonly LocalDateTime[];
  readonly summary: string;
  readonly description: string;
}

const localDateTimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

/** Escapes text values according to RFC 5545 section 3.3.11. */
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

function parseLocalDateTime(value: LocalDateTime): Date {
  const match = localDateTimePattern.exec(value);

  if (!match) {
    throw new Error('Invalid local date-time');
  }

  const [, year, month, day, hour, minute] = match;
  const localDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );

  if (
    localDate.getFullYear() !== Number(year) ||
    localDate.getMonth() !== Number(month) - 1 ||
    localDate.getDate() !== Number(day) ||
    localDate.getHours() !== Number(hour) ||
    localDate.getMinutes() !== Number(minute)
  ) {
    throw new Error('Invalid local date-time');
  }

  return localDate;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Formats a Date as an RFC 5545 floating local date-time (without a Z suffix). */
function formatLocalDateTime(value: Date): string {
  return (
    [String(value.getFullYear()), pad(value.getMonth() + 1), pad(value.getDate())].join('') +
    `T${pad(value.getHours())}${pad(value.getMinutes())}${pad(value.getSeconds())}`
  );
}

function formatTimestamp(value: Date): string {
  return value
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function createUid(now: Date, index: number): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `${now.getTime()}-${index}-${randomPart}@neltadate.local`;
}

/**
 * Builds a local-only RFC 5545 calendar. DTSTART and DTEND are floating local
 * date-times, so the selected wall-clock time is never converted to UTC.
 */
export function buildCalendarIcs(input: CalendarExportInput, now = new Date()): string {
  const timestamp = formatTimestamp(now);
  const events = input.dateTimes.map((dateTime, index) => {
    const startsAt = parseLocalDateTime(dateTime);
    const endsAt = new Date(startsAt);
    endsAt.setHours(endsAt.getHours() + 1);

    return [
      'BEGIN:VEVENT',
      `UID:${createUid(now, index)}`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${formatLocalDateTime(startsAt)}`,
      `DTEND:${formatLocalDateTime(endsAt)}`,
      `SUMMARY:${escapeIcsText(input.summary)}`,
      `DESCRIPTION:${escapeIcsText(input.description)}`,
      'END:VEVENT',
    ];
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Neltadate//Disponibilita appuntamento//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events.flat(),
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
