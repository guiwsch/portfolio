import { BaseScene } from './BaseScene';
import {
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  AmbientLight,
  RepeatWrapping,
  CanvasTexture,
  DoubleSide
} from 'three';
import { OrionTable } from '@/tables/OrionTable';
import { LumiTable } from '@/tables/LumiTable';
import { HugeTable } from '@/tables/HugeTable';
import { BaseTable } from '@/tables/BaseTable';

export class Museum extends BaseScene {
  tables: BaseTable[] = [];

  async init(): Promise<void> {
    const floorTexture = this.createGridTexture();
    const floor = new Mesh(
      new PlaneGeometry(40, 200),
      new MeshStandardMaterial({
        color: 0x080a14,
        metalness: 0.7,
        roughness: 0.4,
        map: floorTexture
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.5, 0);
    this.group.add(floor);

    const ceiling = new Mesh(
      new PlaneGeometry(40, 200),
      new MeshStandardMaterial({ color: 0x040608, side: DoubleSide })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 6, 0);
    this.group.add(ceiling);

    const wallMat = new MeshStandardMaterial({ color: 0x101218, roughness: 0.9 });
    const wallLeft = new Mesh(new PlaneGeometry(200, 8), wallMat);
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(-12, 2, 0);
    this.group.add(wallLeft);

    const wallRight = new Mesh(new PlaneGeometry(200, 8), wallMat.clone());
    wallRight.rotation.y = -Math.PI / 2;
    wallRight.position.set(12, 2, 0);
    this.group.add(wallRight);

    for (let i = 0; i < 6; i++) {
      const z = -50 + i * 20;
      const lightL = new PointLight(0x6688aa, 1.2, 30);
      lightL.position.set(-10, 5, z);
      this.group.add(lightL);

      const lightR = new PointLight(0x6688aa, 1.2, 30);
      lightR.position.set(10, 5, z);
      this.group.add(lightR);
    }

    this.group.add(new AmbientLight(0x202030, 0.2));

    const orion = new OrionTable(0);
    const lumi = new LumiTable(-20);
    const huge = new HugeTable(-40);
    this.tables = [orion, lumi, huge];
    this.tables.forEach((t) => this.group.add(t.group));

    await Promise.all(this.tables.map((t) => t.initHologram()));
  }

  private createGridTexture(): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#080a14';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = 'rgba(80, 100, 140, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 256; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }
    const tex = new CanvasTexture(canvas);
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(10, 50);
    return tex;
  }

  update(delta: number): void {
    this.tables.forEach((t) => t.update(delta));

    const camZ = this.ctx.camera.position.z;
    this.tables.forEach((t) => {
      const dist = Math.abs(camZ - t.group.position.z);
      if (dist < 8 && !t.isLit) {
        t.litUp();
      } else if (dist >= 8 && t.isLit) {
        t.litDown();
      }
    });
  }
}
