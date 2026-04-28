export class SkipIntro {
  private root: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('button');
    this.root.className = 'skip-intro';
    this.root.textContent = 'Pular intro →';
    this.root.addEventListener('click', () => {
      const target = document.getElementById('scroll-museum');
      target?.scrollIntoView({ behavior: 'smooth' });
    });
    parent.appendChild(this.root);
  }
}
