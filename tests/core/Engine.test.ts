import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal<typeof import('three')>();
  class MockRenderer {
    setSize(): void {}
    setPixelRatio(): void {}
    render(): void {}
    dispose(): void {}
  }
  return {
    ...actual,
    WebGLRenderer: MockRenderer
  };
});

vi.mock('gsap/ScrollSmoother', () => ({
  ScrollSmoother: { create: () => ({ kill: () => {} }) }
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: () => ({}),
    getAll: () => []
  }
}));

vi.mock('howler', () => ({
  Howl: class {
    play() {}
    pause() {}
  }
}));

import { Engine } from '@/core/Engine';

describe('Engine', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <canvas id="canvas"></canvas>
      <div id="ui-root"></div>
      <div id="loading-screen"><div class="loading-bar-fill"></div></div>
    `;
  });

  it('finds canvas element on init', () => {
    const e = new Engine();
    expect(e.canvas).toBeInstanceOf(HTMLCanvasElement);
  });

  it('throws if canvas not found', () => {
    document.body.innerHTML = '';
    expect(() => new Engine()).toThrow(/canvas/);
  });
});
