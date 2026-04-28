import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  Clock
} from 'three';

export class Renderer {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  clock: Clock;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new Scene();
    this.scene.background = new Color('#000000');

    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    this.clock = new Clock();

    window.addEventListener('resize', () => this.handleResize());
  }

  private handleResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.renderer.dispose();
  }
}
