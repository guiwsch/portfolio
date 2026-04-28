import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class ProgressBar {
  private root: HTMLDivElement;
  private fill: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'progress-bar';
    this.fill = document.createElement('div');
    this.fill.className = 'progress-bar-fill';
    this.root.appendChild(this.fill);
    parent.appendChild(this.root);

    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        this.fill.style.height = `${self.progress * 100}%`;
      }
    });
  }
}
