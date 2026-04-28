import { afterEach, vi } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
