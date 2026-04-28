import { describe, it, expect, vi } from 'vitest';
import { isMobile } from '@/core/Mobile';

describe('isMobile', () => {
  it('returns true when viewport < 768px', () => {
    vi.stubGlobal('innerWidth', 500);
    expect(isMobile()).toBe(true);
  });

  it('returns false when viewport >= 768px and has mouse', () => {
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('hover: hover'),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    expect(isMobile()).toBe(false);
  });
});
