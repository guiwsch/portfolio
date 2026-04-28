import { describe, it, expect, vi } from 'vitest';
import { isReducedMotion } from '@/core/Reduced';

describe('isReducedMotion', () => {
  it('returns true when matchMedia matches reduce', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    expect(isReducedMotion()).toBe(true);
  });

  it('returns false when matchMedia does not match', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    expect(isReducedMotion()).toBe(false);
  });
});
