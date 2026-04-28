import { describe, it, expect } from 'vitest';
import { easeInOutCubic, easeOutExpo } from '@/lib/easing';

describe('easeInOutCubic', () => {
  it('returns 0 at t=0', () => {
    expect(easeInOutCubic(0)).toBe(0);
  });
  it('returns 1 at t=1', () => {
    expect(easeInOutCubic(1)).toBe(1);
  });
  it('returns 0.5 at t=0.5', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 5);
  });
});

describe('easeOutExpo', () => {
  it('returns 0 at t=0', () => {
    expect(easeOutExpo(0)).toBe(0);
  });
  it('returns 1 at t=1', () => {
    expect(easeOutExpo(1)).toBe(1);
  });
});
