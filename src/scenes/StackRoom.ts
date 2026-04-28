import { BaseScene } from './BaseScene';
import {
  PlaneGeometry,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  Group,
  AmbientLight,
  PointLight
} from 'three';

const ICONS = [
  { name: 'python', url: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'fastapi', url: 'https://cdn.simpleicons.org/fastapi/009688' },
  { name: 'typescript', url: 'https://cdn.simpleicons.org/typescript/3178C6' },
  { name: 'nextdotjs', url: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
  { name: 'react', url: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'postgresql', url: 'https://cdn.simpleicons.org/postgresql/4169E1' },
  { name: 'redis', url: 'https://cdn.simpleicons.org/redis/DC382D' },
  { name: 'docker', url: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'vercel', url: 'https://cdn.simpleicons.org/vercel/ffffff' },
  { name: 'tailwindcss', url: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' }
];

export class StackRoom extends BaseScene {
  private icons: Mesh[] = [];
  private iconGroup: Group = new Group();

  async init(): Promise<void> {
    this.group.add(new AmbientLight(0xffffff, 0.4));
    const point = new PointLight(0xffffff, 2, 50);
    point.position.set(0, 0, 5);
    this.group.add(point);

    const loader = new TextureLoader();
    const radius = 5;
    await Promise.all(
      ICONS.map(async (cfg, idx) => {
        const tex = await loader.loadAsync(cfg.url);
        const mat = new MeshBasicMaterial({ map: tex, transparent: true });
        const plane = new Mesh(new PlaneGeometry(0.8, 0.8), mat);
        const angle = (idx / ICONS.length) * Math.PI * 2;
        plane.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        plane.userData.angle = angle;
        plane.userData.baseRadius = radius;
        this.iconGroup.add(plane);
        this.icons.push(plane);
      })
    );

    this.group.add(this.iconGroup);
  }

  update(delta: number): void {
    this.iconGroup.rotation.z += delta * 0.05;
    this.icons.forEach((icon, idx) => {
      icon.rotation.y += delta * (0.5 + idx * 0.05);
    });
  }
}
