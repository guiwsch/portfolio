import { gsap } from 'gsap';

export class HeroTitle {
  private root: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'hero-title';
    this.root.innerHTML = `
      <h1></h1>
      <p>Software Engineer · Founder of SaaS products</p>
    `;
    parent.appendChild(this.root);
    this.splitTitle('GUILHERME PIRES');
  }

  private splitTitle(text: string): void {
    const h1 = this.root.querySelector('h1') as HTMLElement;
    h1.innerHTML = text
      .split('')
      .map((ch) => `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`)
      .join('');
  }

  async animateIn(): Promise<void> {
    const chars = this.root.querySelectorAll('.char');
    const subtitle = this.root.querySelector('p');

    await gsap
      .timeline()
      .to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power3.out'
      })
      .from(
        subtitle,
        { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
  }

  fadeOut(): void {
    gsap.to(this.root, { opacity: 0, duration: 0.5 });
  }

  fadeIn(): void {
    gsap.to(this.root, { opacity: 1, duration: 0.5 });
  }
}
