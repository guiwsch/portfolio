import { BaseScene } from './BaseScene';
import {
  SphereGeometry,
  Mesh,
  ShaderMaterial,
  PointLight,
  Color,
  AdditiveBlending,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial
} from 'three';
import planetVert from '@/shaders/planet.vert';
import planetFrag from '@/shaders/planet.frag';

export class Hero extends BaseScene {
  private planet!: Mesh;
  private starsField!: Points;
  private material!: ShaderMaterial;

  async init(): Promise<void> {
    const geom = new SphereGeometry(8, 128, 128);
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorBase: { value: new Color('#3a4a6a') },
        uColorAtmosphere: { value: new Color('#7aaaff') }
      },
      vertexShader: planetVert,
      fragmentShader: planetFrag
    });
    this.planet = new Mesh(geom, this.material);
    this.group.add(this.planet);

    const light = new PointLight(0xffffff, 2, 100);
    light.position.set(20, 10, 30);
    this.group.add(light);

    this.starsField = this.createStars(2000);
    this.group.add(this.starsField);

    this.ctx.camera.position.set(0, 0, 80);
    this.ctx.camera.lookAt(0, 0, 0);
  }

  private createStars(count: number): Points {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(positions, 3));
    const mat = new PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending
    });
    return new Points(geom, mat);
  }

  update(delta: number): void {
    this.material.uniforms.uTime.value += delta;
    this.planet.rotation.y += delta * 0.05;
    this.starsField.rotation.y += delta * 0.005;
  }
}
