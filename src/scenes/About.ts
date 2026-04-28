import { BaseScene } from './BaseScene';
import { BoxGeometry, Mesh, MeshStandardMaterial, AmbientLight } from 'three';

export class About extends BaseScene {
  async init(): Promise<void> {
    const cube = new Mesh(
      new BoxGeometry(2, 2, 2),
      new MeshStandardMaterial({ color: 0x664444 })
    );
    cube.position.set(0, 0, 0);
    this.group.add(cube);
    this.group.add(new AmbientLight(0xffffff, 0.6));
  }
}
