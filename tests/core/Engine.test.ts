import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('three', () => {
  class MockGroup {
    visible: boolean = true;
    children: unknown[] = [];
    add(_o: unknown): void {}
    traverse(_fn: (o: unknown) => void): void {}
  }
  class MockScene {
    add(_o: unknown): void {}
  }
  class MockCamera {
    position = { x: 0, y: 0, z: 50, set: () => {} };
    aspect: number = 1;
    updateProjectionMatrix(): void {}
    lookAt(): void {}
  }
  class MockClock {
    getDelta(): number {
      return 0.016;
    }
  }
  class MockRenderer {
    setSize(): void {}
    setPixelRatio(): void {}
    render(): void {}
    dispose(): void {}
  }
  return {
    Group: MockGroup,
    Scene: MockScene,
    PerspectiveCamera: MockCamera,
    Clock: MockClock,
    WebGLRenderer: MockRenderer,
    Color: class {
      constructor(_c: string) {}
    },
    BoxGeometry: class {},
    Mesh: class {
      position = { set: () => {} };
    },
    MeshStandardMaterial: class {},
    AmbientLight: class {}
  };
});

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
