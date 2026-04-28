import { BaseTable } from './BaseTable';

export class LumiTable extends BaseTable {
  constructor(z: number) {
    super({
      name: 'Lumi',
      position: { x: 0, y: 0, z },
      colorCore: '#1e3a8a',
      colorRim: '#fbbf24',
      lightColor: '#3b5dc9',
      lightIntensity: 4,
      holoTextureUrl: '/images/lumi-avatar.png',
      holoTint: '#fbbf24'
    });
  }
}
