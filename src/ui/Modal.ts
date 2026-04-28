export interface ModalContent {
  title: string;
  tagline: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
}

export class Modal {
  private root: HTMLDivElement;
  private content: HTMLDivElement;
  private prevFocus: HTMLElement | null = null;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'modal-backdrop';
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');

    this.content = document.createElement('div');
    this.content.className = 'modal-content';
    this.root.appendChild(this.content);

    parent.appendChild(this.root);

    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.root.classList.contains('open')) {
        this.close();
      }
    });
  }

  open(payload: ModalContent): void {
    this.content.innerHTML = `
      <button class="modal-close" aria-label="Fechar">×</button>
      <h3>${payload.title}</h3>
      <p class="modal-tagline">${payload.tagline}</p>
      <p>${payload.body}</p>
      <a href="${payload.ctaUrl}" target="_blank" rel="noopener" class="modal-cta">${payload.ctaLabel}</a>
    `;
    this.content.querySelector('.modal-close')?.addEventListener('click', () => this.close());
    this.prevFocus = document.activeElement as HTMLElement;
    this.root.classList.add('open');
    (this.content.querySelector('.modal-close') as HTMLElement | null)?.focus();
  }

  close(): void {
    this.root.classList.remove('open');
    this.prevFocus?.focus();
  }
}
