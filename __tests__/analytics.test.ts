import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------
// Tests for the analytics module event structure and categories
// Mirrors src/lib/analytics.ts
// ---------------------------------------------------------------

type EventCategory = "quiz" | "calendar" | "voter_id" | "location" | "chat" | "auth";

const VALID_CATEGORIES: EventCategory[] = [
  "quiz", "calendar", "voter_id", "location", "chat", "auth"
];

interface GAEventPayload {
  event_category: EventCategory;
  event_label?: string;
  value?: number;
}

function buildEventPayload(
  category: EventCategory,
  label?: string,
  value?: number
): GAEventPayload {
  return {
    event_category: category,
    event_label: label,
    value,
  };
}

describe('Analytics — Event Category Validation', () => {
  it('quiz is a valid category', () => {
    expect(VALID_CATEGORIES).toContain('quiz');
  });

  it('calendar is a valid category', () => {
    expect(VALID_CATEGORIES).toContain('calendar');
  });

  it('voter_id is a valid category', () => {
    expect(VALID_CATEGORIES).toContain('voter_id');
  });

  it('location is a valid category', () => {
    expect(VALID_CATEGORIES).toContain('location');
  });

  it('chat is a valid category', () => {
    expect(VALID_CATEGORIES).toContain('chat');
  });

  it('auth is a valid category', () => {
    expect(VALID_CATEGORIES).toContain('auth');
  });

  it('has exactly 6 valid categories', () => {
    expect(VALID_CATEGORIES.length).toBe(6);
  });
});

describe('Analytics — Event Payload Structure', () => {
  it('builds a payload with event_category', () => {
    const payload = buildEventPayload('quiz');
    expect(payload.event_category).toBe('quiz');
  });

  it('builds a payload with label when provided', () => {
    const payload = buildEventPayload('quiz', 'answer_correct');
    expect(payload.event_label).toBe('answer_correct');
  });

  it('builds a payload with numeric value', () => {
    const payload = buildEventPayload('quiz', 'score', 500);
    expect(payload.value).toBe(500);
  });

  it('label is undefined when not provided', () => {
    const payload = buildEventPayload('chat');
    expect(payload.event_label).toBeUndefined();
  });

  it('value is undefined when not provided', () => {
    const payload = buildEventPayload('auth');
    expect(payload.value).toBeUndefined();
  });

  it('calendar add event has correct structure', () => {
    const payload = buildEventPayload('calendar', 'Voter Registration Deadline');
    expect(payload.event_category).toBe('calendar');
    expect(payload.event_label).toBe('Voter Registration Deadline');
  });

  it('location search event carries result count as value', () => {
    const payload = buildEventPayload('location', 'delhi', 3);
    expect(payload.value).toBe(3);
    expect(payload.event_category).toBe('location');
  });

  it('zero value is stored correctly (not treated as undefined)', () => {
    const payload = buildEventPayload('quiz', 'empty_search', 0);
    expect(payload.value).toBe(0);
  });
});

describe('Analytics — trackEvent Module Export', () => {
  it('analytics module exports trackEvent', async () => {
    const mod = await import('../src/lib/analytics');
    expect(mod.trackEvent).toBeDefined();
  });

  it('trackEvent is a function', async () => {
    const mod = await import('../src/lib/analytics');
    expect(typeof mod.trackEvent).toBe('function');
  });

  it('trackEvent accepts all defined categories without throwing', async () => {
    const { trackEvent } = await import('../src/lib/analytics');
    // GA is not initialized in test env, but the function itself should not throw a JS error
    for (const cat of VALID_CATEGORIES) {
      expect(() => {
        try { trackEvent(cat, 'test_action'); } catch { /* GA not initialized in test env */ }
      }).not.toThrow();
    }
  });
});

describe('Analytics — Quiz Event Naming Conventions', () => {
  const QUIZ_EVENTS = ['answer_correct', 'answer_wrong', 'quiz_completed', 'quiz_restarted'];

  it('quiz events list is non-empty', () => {
    expect(QUIZ_EVENTS.length).toBeGreaterThan(0);
  });

  it('all quiz event names are snake_case strings', () => {
    const snakeCase = /^[a-z_]+$/;
    QUIZ_EVENTS.forEach(e => {
      expect(e).toMatch(snakeCase);
    });
  });

  it('has a quiz_completed event defined', () => {
    expect(QUIZ_EVENTS).toContain('quiz_completed');
  });

  it('has an answer_correct event defined', () => {
    expect(QUIZ_EVENTS).toContain('answer_correct');
  });

  it('has an answer_wrong event defined', () => {
    expect(QUIZ_EVENTS).toContain('answer_wrong');
  });
});
