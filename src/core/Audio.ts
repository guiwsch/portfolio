import { Howl } from 'howler';

export type FxName = 'hover' | 'click' | 'transition' | 'landing';

export class Audio {
  private music: Howl | null = null;
  private fx: Map<FxName, Howl> = new Map();
  private musicMuted: boolean = true;
  private fxMuted: boolean = true;

  loadMusic(url: string): void {
    this.music = new Howl({
      src: [url],
      loop: true,
      volume: 0.2,
      preload: true,
      autoplay: false,
      onloaderror: () => {
        // Áudio CC0 não disponível — toggle vira no-op silencioso
        this.music = null;
      }
    });
  }

  loadFx(name: FxName, url: string): void {
    const h = new Howl({
      src: [url],
      volume: 0.5,
      preload: true,
      onloaderror: () => {
        this.fx.delete(name);
      }
    });
    this.fx.set(name, h);
  }

  playFx(name: FxName): void {
    if (this.fxMuted) return;
    this.fx.get(name)?.play();
  }

  toggleMute(): boolean {
    this.musicMuted = !this.musicMuted;
    this.fxMuted = !this.fxMuted;
    if (this.musicMuted) {
      this.music?.pause();
    } else {
      this.music?.play();
    }
    localStorage.setItem('audio_muted', String(this.musicMuted));
    return this.musicMuted;
  }

  initFromStorage(): void {
    const stored = localStorage.getItem('audio_muted');
    this.musicMuted = stored === null ? true : stored === 'true';
    this.fxMuted = this.musicMuted;
    if (!this.musicMuted) this.music?.play();
  }

  isMuted(): boolean {
    return this.musicMuted;
  }
}
