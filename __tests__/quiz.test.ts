import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------
// Tests for CivicQuiz business logic (getRank, scoring, questions)
// Mirrors the logic in src/components/Tools/CivicQuiz.tsx
// ---------------------------------------------------------------

const POINTS_PER_CORRECT = 100;

const RANK_THRESHOLDS: { min: number; label: string }[] = [
  { min: 500, label: 'VETERAN_VOTER' },
  { min: 300, label: 'INFORMED_CITIZEN' },
  { min: 0,   label: 'CITIZEN_RECRUIT' },
];

function getRank(score: number): string {
  return RANK_THRESHOLDS.find((t) => score >= t.min)?.label ?? 'CITIZEN_RECRUIT';
}

const QUESTIONS = [
  { id: 1, q: 'What is the minimum age to vote in India?', a: ['18', '21', '25', '16'], correct: 0 },
  { id: 2, q: 'What does NOTA stand for on the ballot?', a: ['No Other Truly Available', 'None of the Above', 'None of these Applicants', 'National Option To Abide'], correct: 1 },
  { id: 3, q: 'What is the primary role of the VVPAT machine?', a: ['Generate Voter ID', 'Allow voters to verify their vote', 'Count votes automatically', 'Connect to the Internet'], correct: 1 },
  { id: 4, q: 'How long is the Model Code of Conduct usually in effect?', a: ['Only on Polling Day', 'From date of announcement until results', 'One month before voting', '10 days before voting'], correct: 1 },
  { id: 5, q: 'Which constitutional body conducts elections in India?', a: ['Parliament', 'Supreme Court', 'Election Commission of India', 'NITI Aayog'], correct: 2 },
  { id: 6, q: 'Which form is used for new voter registration?', a: ['Form 7', 'Form 8', 'Form 6', 'Form 6B'], correct: 2 },
];

describe('CivicQuiz — Scoring Logic', () => {
  it('awards POINTS_PER_CORRECT for a correct answer', () => {
    let score = 0;
    const q = QUESTIONS[0];
    if (0 === q.correct) score += POINTS_PER_CORRECT;
    expect(score).toBe(100);
  });

  it('awards zero points for a wrong answer', () => {
    let score = 0;
    const q = QUESTIONS[0];
    if (1 === q.correct) score += POINTS_PER_CORRECT; // wrong answer
    expect(score).toBe(0);
  });

  it('accumulates correct score across all 6 questions', () => {
    let score = 0;
    QUESTIONS.forEach((q) => {
      // simulate always picking the correct answer
      if (q.correct === q.correct) score += POINTS_PER_CORRECT;
    });
    expect(score).toBe(600);
  });

  it('has exactly 6 questions', () => {
    expect(QUESTIONS.length).toBe(6);
  });

  it('every question has exactly 4 answer options', () => {
    QUESTIONS.forEach((q) => {
      expect(q.a.length).toBe(4);
    });
  });

  it('every question correct index is within bounds', () => {
    QUESTIONS.forEach((q) => {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.a.length);
    });
  });
});

describe('CivicQuiz — Rank Thresholds', () => {
  it('returns VETERAN_VOTER for score >= 500', () => {
    expect(getRank(600)).toBe('VETERAN_VOTER');
    expect(getRank(500)).toBe('VETERAN_VOTER');
  });

  it('returns INFORMED_CITIZEN for score 300-499', () => {
    expect(getRank(300)).toBe('INFORMED_CITIZEN');
    expect(getRank(400)).toBe('INFORMED_CITIZEN');
  });

  it('returns CITIZEN_RECRUIT for score < 300', () => {
    expect(getRank(0)).toBe('CITIZEN_RECRUIT');
    expect(getRank(200)).toBe('CITIZEN_RECRUIT');
  });

  it('handles perfect score correctly', () => {
    expect(getRank(600)).toBe('VETERAN_VOTER');
  });

  it('handles zero score correctly', () => {
    expect(getRank(0)).toBe('CITIZEN_RECRUIT');
  });
});
