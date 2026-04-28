import { gsap } from 'gsap';

export class BioOverlay {
  private root: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'bio-overlay';
    this.root.innerHTML = `
      <h2 class="bio-title">Sobre</h2>
      <div class="bio-text">
        <p class="bio-line">Engenheiro de software baseado em Florianópolis, fundador e construtor de produtos SaaS.</p>
        <p class="bio-line">Trabalho do código à arquitetura, do design ao deploy.</p>
        <p class="bio-line">Foco em construir produtos que resolvem problemas reais: atendimento via WhatsApp com IA, organização financeira pessoal, automação de e-commerce.</p>
        <p class="bio-line">Backend forte em Python/FastAPI, frontend pixel-perfect em Next.js.</p>
        <p class="bio-line">Construo rápido, valido com usuário real, itero.</p>
      </div>
    `;
    parent.appendChild(this.root);
  }

  show(): void {
    gsap.set(this.root, { opacity: 1 });
    const lines = this.root.querySelectorAll('.bio-line');
    gsap.fromTo(
      lines,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
    );
  }

  hide(): void {
    gsap.to(this.root, { opacity: 0, duration: 0.4 });
  }
}
