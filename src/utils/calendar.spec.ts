import { describe, expect, it } from 'vitest';
import { buildCalendarIcs, escapeIcsText } from './calendar';

describe('calendar export', () => {
  it('escapes RFC 5545 text values', () => {
    expect(escapeIcsText('Uno\\due, tre; quattro\ncinque')).toBe(
      'Uno\\\\due\\, tre\\; quattro\\ncinque',
    );
  });

  it('creates one floating local VEVENT per proposed availability', () => {
    const calendar = buildCalendarIcs(
      {
        dateTimes: ['2032-06-14T18:45', '2032-06-15T23:30'],
        preferredDateTime: '2032-06-14T18:45',
        summary: 'Invito, speciale; con \\ sorpresa',
        description: 'Il luogo resta una sorpresa.\nPorta la curiosità.',
      },
      new Date('2032-01-02T03:04:05.000Z'),
    );

    expect(calendar).toContain('BEGIN:VCALENDAR\r\nVERSION:2.0');
    expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(calendar).toContain('DTSTAMP:20320102T030405Z');
    expect(calendar).toContain('DTSTART:20320614T184500');
    expect(calendar).toContain('DTEND:20320614T194500');
    expect(calendar).toContain('DTSTART:20320615T233000');
    expect(calendar).toContain('DTEND:20320616T003000');
    expect(calendar).toContain('SUMMARY:Invito\\, speciale\\; con \\\\ sorpresa');
    expect(calendar).toContain('DESCRIPTION:Il luogo resta una sorpresa.\\nPorta la curiosità.');
    expect(calendar).toContain('SUMMARY:Invito\\, speciale\\; con \\\\ sorpresa — preferita');
    expect(calendar).toContain(
      'DESCRIPTION:Il luogo resta una sorpresa.\\nPorta la curiosità.\\nQuesta è la disponibilità preferita.',
    );
    expect(calendar).not.toContain('DTSTART:20320614T184500Z');
    expect(calendar.match(/UID:[^\r\n]+@neltadate\.local/g)).toHaveLength(2);
  });

  it('keeps the existing event text when no preferred availability is set', () => {
    const calendar = buildCalendarIcs(
      {
        dateTimes: ['2032-06-14T18:45'],
        summary: 'Invito',
        description: 'Una sorpresa.',
      },
      new Date('2032-01-02T03:04:05.000Z'),
    );

    expect(calendar).toContain('SUMMARY:Invito\r\n');
    expect(calendar).toContain('DESCRIPTION:Una sorpresa.\r\n');
    expect(calendar).not.toContain('preferita');
  });
});
