import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------
// Tests for CalendarSync URL generation logic
// Mirrors the logic in src/components/Tools/CalendarSync.tsx
// ---------------------------------------------------------------

/** Builds a Google Calendar event URL (same logic as the component) */
function buildCalendarUrl(event: string, date: string, time: string): string {
  const start = date.replace(/-/g, '') + 'T' + time.replace(/:/g, '') + '00Z';
  const endHour = (parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0');
  const end = date.replace(/-/g, '') + 'T' + endHour + time.split(':')[1] + '00Z';
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event)}&dates=${start}/${end}&details=${encodeURIComponent('Electoral Deadline - Electra Civic OS')}&location=India&sf=true&output=xml`;
}

const UPCOMING_DATES = [
  { id: 1, event: 'Voter Registration Deadline', date: '2026-05-15', time: '17:00', type: 'Deadline' },
  { id: 2, event: 'National Polling Day',         date: '2026-06-01', time: '07:00', type: 'Polling' },
  { id: 3, event: 'Postal Ballot Submission',     date: '2026-05-20', time: '18:00', type: 'Submission' },
  { id: 4, event: 'Final Result Declaration',     date: '2026-06-05', time: '10:00', type: 'Results' },
];

describe('CalendarSync — URL Generation', () => {
  it('produces a valid Google Calendar URL', () => {
    const url = buildCalendarUrl('Voter Registration Deadline', '2026-05-15', '17:00');
    expect(url).toContain('https://www.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
  });

  it('encodes the event name in the URL', () => {
    const url = buildCalendarUrl('National Polling Day', '2026-06-01', '07:00');
    expect(url).toContain(encodeURIComponent('National Polling Day'));
  });

  it('sets start datetime correctly (no dashes, appends T time Z)', () => {
    const url = buildCalendarUrl('Test Event', '2026-05-15', '09:00');
    expect(url).toContain('20260515T090000Z');
  });

  it('sets end time 1 hour after start', () => {
    const url = buildCalendarUrl('Test Event', '2026-05-15', '09:00');
    expect(url).toContain('20260515T100000Z');
  });

  it('includes the location India', () => {
    const url = buildCalendarUrl('Test', '2026-05-15', '09:00');
    expect(url).toContain('location=India');
  });

  it('includes Electra branding in details', () => {
    const url = buildCalendarUrl('Test', '2026-05-15', '09:00');
    expect(url).toContain('Electra');
  });
});

describe('CalendarSync — Event Data Integrity', () => {
  it('has exactly 4 upcoming dates defined', () => {
    expect(UPCOMING_DATES.length).toBe(4);
  });

  it('all events have a non-empty event name', () => {
    UPCOMING_DATES.forEach((d) => {
      expect(d.event.length).toBeGreaterThan(0);
    });
  });

  it('all dates are in ISO 8601 format YYYY-MM-DD', () => {
    const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
    UPCOMING_DATES.forEach((d) => {
      expect(d.date).toMatch(isoPattern);
    });
  });

  it('all times are in HH:MM format', () => {
    const timePattern = /^\d{2}:\d{2}$/;
    UPCOMING_DATES.forEach((d) => {
      expect(d.time).toMatch(timePattern);
    });
  });

  it('all events have unique IDs', () => {
    const ids = UPCOMING_DATES.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
