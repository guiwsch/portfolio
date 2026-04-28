import { BaseTable } from './BaseTable';

export class HugeTable extends BaseTable {
  constructor(z: number) {
    super({
      name: 'Huge ML',
      position: { x: 0, y: 0, z },
      colorCore: '#2a2a00',
      colorRim: '#ffe600',
      lightColor: '#ffe600',
      lightIntensity: 5,
      holoTextureUrl: '/images/huge-ml.png',
      holoTint: '#ffe600'
    });
  }
}
