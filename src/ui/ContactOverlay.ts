export class ContactOverlay {
  private root: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'contact-overlay';
    this.root.innerHTML = `
      <h2>Vamos conversar?</h2>
      <ul class="contact-list">
        <li><a href="mailto:contato.guilhermepires.dev@gmail.com">contato.guilhermepires.dev@gmail.com</a></li>
        <li><a href="https://www.linkedin.com/in/guilherme-pires-3b768527b/" target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="https://github.com/guiwsch" target="_blank" rel="noopener">GitHub</a></li>
      </ul>
      <button class="back-to-top" aria-label="Voltar ao início">↑ Voltar ao início</button>
    `;
    this.root.querySelector('.back-to-top')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    parent.appendChild(this.root);
  }

  show(): void {
    this.root.style.opacity = '1';
  }
  hide(): void {
    this.root.style.opacity = '0';
  }
}
