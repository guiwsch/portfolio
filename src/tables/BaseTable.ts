import {
  CylinderGeometry,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  ShaderMaterial,
  Group,
  PointLight,
  Color,
  PlaneGeometry,
  TextureLoader
} from 'three';
import { gsap } from 'gsap';
import orbVert from '@/shaders/orb.vert';
import orbFrag from '@/shaders/orb.frag';
import holoVert from '@/shaders/hologram.vert';
import holoFrag from '@/shaders/hologram.frag';

export interface TableConfig {
  name: string;
  position: { x: number; y: number; z: number };
  colorCore: string;
  colorRim: string;
  lightColor: string;
  lightIntensity: number;
  holoTextureUrl: string;
  holoTint: string;
}

export class BaseTable {
  config: TableConfig;
  group: Group;
  pedestal!: Mesh;
  orb!: Mesh;
  orbMaterial!: ShaderMaterial;
  light!: PointLight;
  holoMaterial?: ShaderMaterial;
  isLit: boolean = false;

  constructor(config: TableConfig) {
    this.config = config;
    this.group = new Group();
    this.group.position.set(config.position.x, config.position.y, config.position.z);

    this.buildPedestal();
    this.buildOrb();
    this.buildLight();
  }

  private buildPedestal(): void {
    const geom = new CylinderGeometry(1.2, 1.4, 1.5, 8);
    const mat = new MeshStandardMaterial({
      color: 0x202028,
      metalness: 0.7,
      roughness: 0.3
    });
    this.pedestal = new Mesh(geom, mat);
    this.pedestal.position.y = -0.75;
    this.group.add(this.pedestal);
  }

  private buildOrb(): void {
    const geom = new SphereGeometry(0.7, 64, 64);
    this.orbMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorCore: { value: new Color(this.config.colorCore) },
        uColorRim: { value: new Color(this.config.colorRim) }
      },
      vertexShader: orbVert,
      fragmentShader: orbFrag
    });
    this.orb = new Mesh(geom, this.orbMaterial);
    this.orb.position.y = 1.2;
    this.group.add(this.orb);
  }

  private buildLight(): void {
    this.light = new PointLight(this.config.lightColor, 0, 25);
    this.light.position.set(0, 4, 0);
    this.group.add(this.light);
  }

  async initHologram(): Promise<void> {
    const loader = new TextureLoader();
    const tex = await loader.loadAsync(this.config.holoTextureUrl);
    this.holoMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: tex },
        uTint: { value: new Color(this.config.holoTint) }
      },
      vertexShader: holoVert,
      fragmentShader: holoFrag,
      transparent: true,
      depthWrite: false
    });
    const plane = new Mesh(new PlaneGeometry(2.4, 2.4), this.holoMaterial);
    plane.position.set(0, 1.2, -1.4);
    this.group.add(plane);
  }

  litUp(): void {
    if (this.isLit) return;
    this.isLit = true;
    gsap.to(this.light, {
      intensity: this.config.lightIntensity,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  litDown(): void {
    if (!this.isLit) return;
    this.isLit = false;
    gsap.to(this.light, { intensity: 0, duration: 0.8, ease: 'power2.in' });
  }

  update(delta: number): void {
    this.orbMaterial.uniforms.uTime.value += delta;
    this.orb.rotation.y += delta * 0.3;
    if (this.holoMaterial) {
      this.holoMaterial.uniforms.uTime.value += delta;
    }
  }
}
