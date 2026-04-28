import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SECTIONS = [
  { id: 'scroll-hero', label: 'Início' },
  { id: 'scroll-about', label: 'Sobre' },
  { id: 'scroll-museum', label: 'Museu' },
  { id: 'scroll-stack', label: 'Stack' },
  { id: 'scroll-contact', label: 'Contato' }
];

export class SectionDots {
  private root: HTMLElement;
  private dots: HTMLButtonElement[] = [];

  constructor(parent: HTMLElement) {
    this.root = document.createElement('nav');
    this.root.className = 'section-dots';
    this.root.setAttribute('aria-label', 'Navegação por seção');

    SECTIONS.forEach((s) => {
      const btn = document.createElement('button');
      btn.className = 'section-dot';
      btn.setAttribute('aria-label', s.label);
      btn.dataset.target = s.id;
      btn.innerHTML = `<span class="dot"></span><span class="label">${s.label}</span>`;
      btn.addEventListener('click', () => {
        const target = document.getElementById(s.id);
        target?.scrollIntoView({ behavior: 'smooth' });
      });
      this.dots.push(btn);
      this.root.appendChild(btn);
    });

    parent.appendChild(this.root);

    SECTIONS.forEach((s, idx) => {
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) this.setActive(idx);
        }
      });
    });
  }

  private setActive(idx: number): void {
    this.dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }
}
