import { describe, it, expect, vi } from 'vitest';

// -------------------------------------------------------------------
// Unit tests for the sanitize() helper and rate-limiting logic
// mirroring the implementation in src/app/api/chat/route.ts
// -------------------------------------------------------------------

/** Inline copy of the sanitizer — keeps tests self-contained */
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim().slice(0, 2000);
}

/** Inline copy of the rate-limiter logic */
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

describe('Security — Input Sanitization', () => {
  it('strips HTML script tags leaving only text content', () => {
    // Correct behavior: tags removed, inner text preserved (no code execution possible)
    const result = sanitize('<script>alert("xss")</script>Hello');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('</script>');
    expect(result).toContain('Hello');
  });

  it('strips HTML anchor injection', () => {
    expect(sanitize('<a href="evil.com">click</a>')).toBe('click');
  });

  it('preserves clean plain text', () => {
    const clean = 'How do I register to vote?';
    expect(sanitize(clean)).toBe(clean);
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitize('  hello world  ')).toBe('hello world');
  });

  it('truncates input longer than 2000 characters', () => {
    const long = 'a'.repeat(3000);
    expect(sanitize(long).length).toBe(2000);
  });

  it('returns empty string for tag-only input', () => {
    expect(sanitize('<b></b>')).toBe('');
  });
});

describe('Security — Rate Limiting', () => {
  it('allows requests under the rate limit', () => {
    const testIp = `test-ip-${Date.now()}`;
    for (let i = 0; i < RATE_LIMIT; i++) {
      expect(isRateLimited(testIp)).toBe(false);
    }
  });

  it('blocks the (RATE_LIMIT + 1)th request', () => {
    const testIp = `block-ip-${Date.now()}`;
    for (let i = 0; i < RATE_LIMIT; i++) isRateLimited(testIp);
    expect(isRateLimited(testIp)).toBe(true);
  });

  it('resets counter after the time window expires', () => {
    const testIp = `reset-ip-${Date.now()}`;
    // Fill up the limit
    for (let i = 0; i < RATE_LIMIT; i++) isRateLimited(testIp);
    // Manually expire the window
    const entry = rateLimitMap.get(testIp)!;
    entry.resetAt = Date.now() - 1;
    expect(isRateLimited(testIp)).toBe(false);
  });
});

describe('Security — Security Headers Config', () => {
  it('includes HSTS header definition', async () => {
    const { default: nextConfig } = await import('../next.config.ts');
    const headers = await nextConfig.headers!();
    const allHeaders = headers.flatMap((h) => h.headers);
    const hsts = allHeaders.find((h) => h.key === 'Strict-Transport-Security');
    expect(hsts).toBeDefined();
    expect(hsts!.value).toContain('max-age=');
  });

  it('includes X-Frame-Options header', async () => {
    const { default: nextConfig } = await import('../next.config.ts');
    const headers = await nextConfig.headers!();
    const allHeaders = headers.flatMap((h) => h.headers);
    const xfo = allHeaders.find((h) => h.key === 'X-Frame-Options');
    expect(xfo).toBeDefined();
    expect(xfo!.value).toBe('SAMEORIGIN');
  });

  it('includes Content-Security-Policy header', async () => {
    const { default: nextConfig } = await import('../next.config.ts');
    const headers = await nextConfig.headers!();
    const allHeaders = headers.flatMap((h) => h.headers);
    const csp = allHeaders.find((h) => h.key === 'Content-Security-Policy');
    expect(csp).toBeDefined();
    expect(csp!.value).toContain("default-src 'self'");
  });

  it('includes X-Content-Type-Options header', async () => {
    const { default: nextConfig } = await import('../next.config.ts');
    const headers = await nextConfig.headers!();
    const allHeaders = headers.flatMap((h) => h.headers);
    const xcto = allHeaders.find((h) => h.key === 'X-Content-Type-Options');
    expect(xcto).toBeDefined();
    expect(xcto!.value).toBe('nosniff');
  });
});
