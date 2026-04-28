import { describe, it, expect, beforeEach } from 'vitest';
import { Loader } from '@/core/Loader';

describe('Loader', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="loading-screen">
        <div class="loading-bar-fill"></div>
      </div>
    `;
  });

  it('starts at 0 progress', () => {
    const l = new Loader([]);
    expect(l.progress).toBe(0);
  });

  it('reports 100% when all assets done', async () => {
    const l = new Loader([]);
    await l.load();
    expect(l.progress).toBe(1);
  });

  it('updates progress bar fill width', async () => {
    const l = new Loader([]);
    await l.load();
    const fill = document.querySelector('.loading-bar-fill') as HTMLElement;
    expect(fill.style.width).toMatch(/^100(\.0)?%$/);
  });

  it('hides screen after load', async () => {
    const l = new Loader([]);
    await l.load();
    l.hide();
    const screen = document.getElementById('loading-screen');
    expect(screen?.classList.contains('hidden')).toBe(true);
  });
});
