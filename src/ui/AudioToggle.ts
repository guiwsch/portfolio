import type { Audio } from '@/core/Audio';

export class AudioToggle {
  private root: HTMLButtonElement;
  private audio: Audio;

  constructor(parent: HTMLElement, audio: Audio) {
    this.audio = audio;
    this.root = document.createElement('button');
    this.root.className = 'audio-toggle';
    this.root.setAttribute('aria-label', 'Alternar áudio');
    this.root.addEventListener('click', () => this.toggle());
    parent.appendChild(this.root);
    this.render();
  }

  private toggle(): void {
    this.audio.toggleMute();
    this.render();
  }

  private render(): void {
    const muted = this.audio.isMuted();
    this.root.textContent = muted ? '♪ off' : '♪ on';
    this.root.classList.toggle('muted', muted);
  }
}
