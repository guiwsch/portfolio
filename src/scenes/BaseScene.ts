import { Group, Object3D, PerspectiveCamera, Scene } from 'three';

export interface SceneContext {
  camera: PerspectiveCamera;
  rootScene: Scene;
}

export abstract class BaseScene {
  group: Group;
  ctx: SceneContext;
  active: boolean = false;

  constructor(ctx: SceneContext) {
    this.ctx = ctx;
    this.group = new Group();
    this.group.visible = false;
    ctx.rootScene.add(this.group);
  }

  abstract init(): Promise<void>;

  enter(): void {
    this.active = true;
    this.group.visible = true;
  }

  update(_delta: number): void {
    // Override em subclasses
  }

  exit(): void {
    this.active = false;
    this.group.visible = false;
  }

  dispose(): void {
    this.ctx.rootScene.remove(this.group);
    this.group.traverse((obj: Object3D) => {
      const o = obj as { geometry?: { dispose: () => void }; material?: { dispose: () => void } };
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
  }
}
