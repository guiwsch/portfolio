import { BaseScene } from './BaseScene';
import {
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  AmbientLight,
  Color,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending
} from 'three';

export class About extends BaseScene {
  private avatar!: Mesh;
  private dust!: Points;

  async init(): Promise<void> {
    const geom = new IcosahedronGeometry(2, 1);
    const mat = new MeshStandardMaterial({
      color: new Color('#3a4868'),
      metalness: 0.4,
      roughness: 0.5,
      flatShading: true
    });
    this.avatar = new Mesh(geom, mat);
    this.avatar.position.set(-3, 0, 0);
    this.avatar.scale.set(1, 1.6, 1);
    this.group.add(this.avatar);

    const light = new PointLight(0x6a8aff, 12, 40);
    light.position.set(-3, 3, 6);
    this.group.add(light);

    const fillLight = new PointLight(0xff8866, 6, 30);
    fillLight.position.set(-6, -2, 3);
    this.group.add(fillLight);

    this.group.add(new AmbientLight(0x202840, 0.6));

    this.dust = this.createDust(300);
    this.group.add(this.dust);
  }

  enter(): void {
    super.enter();
    this.ctx.camera.position.set(-1, 0, 7);
    this.ctx.camera.lookAt(-3, 0, 0);
  }

  private createDust(count: number): Points {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(positions, 3));
    const mat = new PointsMaterial({
      color: 0xaaaaff,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending
    });
    return new Points(geom, mat);
  }

  update(delta: number): void {
    this.avatar.rotation.y += delta * 0.1;
    this.dust.rotation.y += delta * 0.02;
  }
}
