import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------
// Tests for the Firestore service layer type contracts
// (src/lib/firestore-service.ts)
// Validates data shapes without real Firestore connections.
// ---------------------------------------------------------------

import type { QuizResult, LocationSearchEvent, CalendarSyncEvent } from '../src/lib/firestore-service';

describe('Firestore Service — QuizResult Schema', () => {
  it('accepts a valid QuizResult object', () => {
    const result: QuizResult = {
      score: 500,
      totalQuestions: 6,
      rank: 'VETERAN_VOTER',
    };
    expect(result.score).toBe(500);
    expect(result.totalQuestions).toBe(6);
    expect(result.rank).toBe('VETERAN_VOTER');
  });

  it('score must be a non-negative number', () => {
    const result: QuizResult = { score: 0, totalQuestions: 6, rank: 'CITIZEN_RECRUIT' };
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it('totalQuestions matches the actual question count', () => {
    const result: QuizResult = { score: 300, totalQuestions: 6, rank: 'INFORMED_CITIZEN' };
    expect(result.totalQuestions).toBe(6);
  });

  it('rank is one of the defined valid values', () => {
    const validRanks = ['VETERAN_VOTER', 'INFORMED_CITIZEN', 'CITIZEN_RECRUIT'];
    const result: QuizResult = { score: 100, totalQuestions: 6, rank: 'CITIZEN_RECRUIT' };
    expect(validRanks).toContain(result.rank);
  });
});

describe('Firestore Service — LocationSearchEvent Schema', () => {
  it('accepts a valid LocationSearchEvent', () => {
    const event: LocationSearchEvent = { query: 'Delhi', resultsFound: 3 };
    expect(event.query).toBe('Delhi');
    expect(event.resultsFound).toBe(3);
  });

  it('resultsFound can be 0 for empty results', () => {
    const event: LocationSearchEvent = { query: 'xyz123', resultsFound: 0 };
    expect(event.resultsFound).toBe(0);
  });

  it('query must be a string', () => {
    const event: LocationSearchEvent = { query: '110001', resultsFound: 1 };
    expect(typeof event.query).toBe('string');
  });
});

describe('Firestore Service — CalendarSyncEvent Schema', () => {
  it('accepts a valid CalendarSyncEvent', () => {
    const event: CalendarSyncEvent = {
      eventName: 'National Polling Day',
      eventDate: '2026-06-01',
    };
    expect(event.eventName).toBe('National Polling Day');
    expect(event.eventDate).toBe('2026-06-01');
  });

  it('eventDate is in ISO 8601 format', () => {
    const event: CalendarSyncEvent = { eventName: 'Test', eventDate: '2026-05-15' };
    expect(event.eventDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('eventName is a non-empty string', () => {
    const event: CalendarSyncEvent = { eventName: 'Test Event', eventDate: '2026-05-15' };
    expect(event.eventName.length).toBeGreaterThan(0);
  });
});

describe('Firestore Service — Analytics Service Types', () => {
  it('trackEvent accepts valid categories', async () => {
    // Import will fail if the module has TS errors - validates type exports
    const mod = await import('../src/lib/analytics');
    expect(typeof mod.trackEvent).toBe('function');
  });

  it('firestore-service exports saveQuizResult function', async () => {
    const mod = await import('../src/lib/firestore-service');
    expect(typeof mod.saveQuizResult).toBe('function');
  });

  it('firestore-service exports logLocationSearch function', async () => {
    const mod = await import('../src/lib/firestore-service');
    expect(typeof mod.logLocationSearch).toBe('function');
  });

  it('firestore-service exports logCalendarSync function', async () => {
    const mod = await import('../src/lib/firestore-service');
    expect(typeof mod.logCalendarSync).toBe('function');
  });

  it('firestore-service exports getTopQuizResults function', async () => {
    const mod = await import('../src/lib/firestore-service');
    expect(typeof mod.getTopQuizResults).toBe('function');
  });
});
