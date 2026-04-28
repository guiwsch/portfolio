import { describe, it, expect } from 'vitest';
import { lerp, clamp, map } from '@/lib/lerp';

describe('lerp', () => {
  it('returns start when t=0', () => {
    expect(lerp(0, 100, 0)).toBe(0);
  });

  it('returns end when t=1', () => {
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it('returns midpoint when t=0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });
});

describe('clamp', () => {
  it('clamps within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('map', () => {
  it('maps value from one range to another', () => {
    expect(map(5, 0, 10, 0, 100)).toBe(50);
    expect(map(0.5, 0, 1, 100, 200)).toBe(150);
  });
});
