import { describe, expect, it } from 'vitest';
import { formatAvailabilityContext, isFutureLocalDateTime, isValidLocalDateTime } from './dateTime';

describe('date-time availability helpers', () => {
  it('recognizes valid local values and rejects impossible calendar dates', () => {
    expect(isValidLocalDateTime('2032-02-29T09:15')).toBe(true);
    expect(isValidLocalDateTime('2031-02-29T09:15')).toBe(false);
  });

  it('compares the selected local date-time against the local clock', () => {
    const now = new Date(2032, 5, 14, 18, 45, 30);

    expect(isFutureLocalDateTime('2032-06-14T18:45', now)).toBe(false);
    expect(isFutureLocalDateTime('2032-06-14T18:46', now)).toBe(true);
    expect(isFutureLocalDateTime('2032-06-15T00:00', now)).toBe(true);
  });

  it('adds a weekday and an Italian day-period context', () => {
    expect(formatAvailabilityContext('2032-06-14T09:15')).toBe('lunedì 14 giugno · mattina');
    expect(formatAvailabilityContext('2032-06-14T14:15')).toBe('lunedì 14 giugno · pomeriggio');
    expect(formatAvailabilityContext('2032-06-14T20:15')).toBe('lunedì 14 giugno · sera');
  });
});
