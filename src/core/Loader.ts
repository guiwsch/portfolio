import { clamp } from '@/lib/lerp';

export type LoadableAsset =
  | { type: 'image'; url: string }
  | { type: 'audio'; url: string }
  | { type: 'json'; url: string };

export class Loader {
  progress: number = 0;
  private assets: LoadableAsset[];
  private loaded: Map<string, unknown> = new Map();
  private barFill: HTMLElement | null;
  private screen: HTMLElement | null;

  constructor(assets: LoadableAsset[]) {
    this.assets = assets;
    this.barFill = document.querySelector('.loading-bar-fill');
    this.screen = document.getElementById('loading-screen');
  }

  async load(): Promise<void> {
    if (this.assets.length === 0) {
      this.setProgress(1);
      return;
    }
    let done = 0;
    await Promise.all(
      this.assets.map(async (asset) => {
        await this.loadAsset(asset);
        done += 1;
        this.setProgress(clamp(done / this.assets.length, 0, 1));
      })
    );
  }

  private async loadAsset(asset: LoadableAsset): Promise<void> {
    if (asset.type === 'image') {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed: ${asset.url}`));
        img.src = asset.url;
      });
      this.loaded.set(asset.url, img);
    } else if (asset.type === 'audio') {
      const audio = new Audio(asset.url);
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject(new Error(`Failed: ${asset.url}`));
        audio.load();
      });
      this.loaded.set(asset.url, audio);
    } else if (asset.type === 'json') {
      const res = await fetch(asset.url);
      const data = await res.json();
      this.loaded.set(asset.url, data);
    }
  }

  private setProgress(p: number): void {
    this.progress = p;
    if (this.barFill) {
      this.barFill.style.width = `${(p * 100).toFixed(1)}%`;
    }
  }

  hide(): void {
    this.screen?.classList.add('hidden');
  }

  get<T>(url: string): T | undefined {
    return this.loaded.get(url) as T | undefined;
  }
}
