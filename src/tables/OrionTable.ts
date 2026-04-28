import { BaseTable } from './BaseTable';

export class OrionTable extends BaseTable {
  constructor(z: number) {
    super({
      name: 'Orion',
      position: { x: 0, y: 0, z },
      colorCore: '#1a1a2a',
      colorRim: '#e8e8f0',
      lightColor: '#e8e8f0',
      lightIntensity: 3,
      holoTextureUrl: '/images/orion-logo.png',
      holoTint: '#ffffff'
    });
  }
}
