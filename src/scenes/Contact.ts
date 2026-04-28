import { BaseScene } from './BaseScene';
import {
  SphereGeometry,
  Mesh,
  ShaderMaterial,
  Color,
  PointLight,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending
} from 'three';
import planetVert from '@/shaders/planet.vert';
import planetFrag from '@/shaders/planet.frag';

export class Contact extends BaseScene {
  private planet!: Mesh;
  private starsField!: Points;
  private material!: ShaderMaterial;

  async init(): Promise<void> {
    const geom = new SphereGeometry(6, 96, 96);
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

    const light = new PointLight(0xffffff, 1.8, 80);
    light.position.set(15, 8, 20);
    this.group.add(light);

    const positions = new Float32Array(2500 * 3);
    for (let i = 0; i < 2500; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    const sgeom = new BufferGeometry();
    sgeom.setAttribute('position', new BufferAttribute(positions, 3));
    this.starsField = new Points(
      sgeom,
      new PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.7,
        blending: AdditiveBlending
      })
    );
    this.group.add(this.starsField);
  }

  update(delta: number): void {
    this.material.uniforms.uTime.value += delta;
    this.planet.rotation.y += delta * 0.03;
    this.starsField.rotation.y += delta * 0.005;
  }
}
