import { Renderer } from '@/core/Renderer';
import { Loader } from '@/core/Loader';
import { BaseScene, SceneContext } from '@/scenes/BaseScene';
import { Hero } from '@/scenes/Hero';
import { About } from '@/scenes/About';
import { Museum } from '@/scenes/Museum';
import { StackRoom } from '@/scenes/StackRoom';
import { Contact } from '@/scenes/Contact';

export class Engine {
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  scenes: BaseScene[] = [];
  currentSceneIndex: number = 0;
  private rafId: number | null = null;

  constructor() {
    const canvas = document.getElementById('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas element not found');
    }
    this.canvas = canvas;
    this.renderer = new Renderer(this.canvas);
  }

  async start(): Promise<void> {
    const loader = new Loader([
      { type: 'image', url: '/images/orion-logo.png' },
      { type: 'image', url: '/images/lumi-avatar.png' },
      { type: 'image', url: '/images/huge-ml.png' }
    ]);
    await loader.load();

    const ctx: SceneContext = {
      camera: this.renderer.camera,
      rootScene: this.renderer.scene
    };

    this.scenes = [
      new Hero(ctx),
      new About(ctx),
      new Museum(ctx),
      new StackRoom(ctx),
      new Contact(ctx)
    ];

    await Promise.all(this.scenes.map((s) => s.init()));
    this.scenes[0].enter();

    setTimeout(() => loader.hide(), 300);

    this.tick();
  }

  goToScene(index: number): void {
    if (index === this.currentSceneIndex) return;
    this.scenes[this.currentSceneIndex]?.exit();
    this.currentSceneIndex = index;
    this.scenes[index]?.enter();
  }

  private tick = (): void => {
    this.rafId = requestAnimationFrame(this.tick);
    const delta = this.renderer.clock.getDelta();
    this.scenes[this.currentSceneIndex]?.update(delta);
    this.renderer.render();
  };

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
