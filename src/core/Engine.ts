import { Renderer } from '@/core/Renderer';
import { Loader } from '@/core/Loader';
import { Audio } from '@/core/Audio';
import { BaseScene, SceneContext } from '@/scenes/BaseScene';
import { Hero } from '@/scenes/Hero';
import { About } from '@/scenes/About';
import { Museum as MuseumScene } from '@/scenes/Museum';
import { StackRoom } from '@/scenes/StackRoom';
import { Contact } from '@/scenes/Contact';
import { ScrollFlow } from '@/lib/scrollFlow';
import { HeroTitle } from '@/ui/HeroTitle';
import { BioOverlay } from '@/ui/BioOverlay';
import { ContactOverlay } from '@/ui/ContactOverlay';
import { Modal } from '@/ui/Modal';
import { AudioToggle } from '@/ui/AudioToggle';
import { ProgressBar } from '@/ui/ProgressBar';
import { SectionDots } from '@/ui/SectionDots';
import { SkipIntro } from '@/ui/SkipIntro';
import { Raycaster, Vector2 } from 'three';

export class Engine {
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  scenes: BaseScene[] = [];
  currentSceneIndex: number = 0;
  scrollFlow!: ScrollFlow;
  modal!: Modal;
  audio: Audio;
  private heroTitle!: HeroTitle;
  private bio!: BioOverlay;
  private contactOverlay!: ContactOverlay;
  private rafId: number | null = null;
  private raycaster = new Raycaster();
  private pointer = new Vector2();

  constructor() {
    const canvas = document.getElementById('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas element not found');
    }
    this.canvas = canvas;
    this.renderer = new Renderer(this.canvas);
    this.audio = new Audio();
  }

  async start(): Promise<void> {
    const loader = new Loader([
      { type: 'image', url: '/images/orion-logo.png' },
      { type: 'image', url: '/images/lumi-avatar.png' },
      { type: 'image', url: '/images/huge-ml.png' }
    ]);
    await loader.load();

    const ctx: SceneContext = {
      camera: this.renderer.camera,
      rootScene: this.renderer.scene
    };

    this.scenes = [
      new Hero(ctx),
      new About(ctx),
      new MuseumScene(ctx),
      new StackRoom(ctx),
      new Contact(ctx)
    ];

    await Promise.all(this.scenes.map((s) => s.init()));
    this.scenes[0].enter();

    const uiRoot = document.getElementById('ui-root');
    if (!uiRoot) throw new Error('ui-root element not found');

    this.heroTitle = new HeroTitle(uiRoot);
    this.bio = new BioOverlay(uiRoot);
    this.contactOverlay = new ContactOverlay(uiRoot);
    this.modal = new Modal(uiRoot);

    this.audio.loadMusic('/audio/ambient.mp3');
    this.audio.loadFx('hover', '/audio/hover.mp3');
    this.audio.loadFx('click', '/audio/click.mp3');
    this.audio.loadFx('transition', '/audio/transition.mp3');
    this.audio.loadFx('landing', '/audio/landing.mp3');
    this.audio.initFromStorage();

    new AudioToggle(uiRoot, this.audio);
    new ProgressBar(uiRoot);
    new SectionDots(uiRoot);
    new SkipIntro(uiRoot);

    this.scrollFlow = new ScrollFlow(this.renderer.camera);
    this.scrollFlow.setupHero({
      onEnter: () => {
        this.goToScene(0);
        this.heroTitle.fadeIn();
      },
      onLeave: () => {
        this.heroTitle.fadeOut();
      }
    });
    this.scrollFlow.setupAbout({
      onEnter: () => {
        this.goToScene(1);
        this.bio.show();
      },
      onLeave: () => {
        this.bio.hide();
      }
    });
    this.scrollFlow.setupMuseum({
      onEnter: () => this.goToScene(2),
      onLeave: () => {}
    });
    this.scrollFlow.setupStack({
      onEnter: () => this.goToScene(3),
      onLeave: () => {}
    });
    this.scrollFlow.setupContact({
      onEnter: () => {
        this.goToScene(4);
        this.contactOverlay.show();
      },
      onLeave: () => {
        this.contactOverlay.hide();
      }
    });

    this.setupTableHover();
    this.setupTableClicks();
    this.setupKeyboard();

    setTimeout(() => {
      loader.hide();
      this.heroTitle.animateIn();
    }, 300);

    this.tick();
  }

  goToScene(index: number): void {
    if (index === this.currentSceneIndex) return;
    this.scenes[this.currentSceneIndex]?.exit();
    this.currentSceneIndex = index;
    this.scenes[index]?.enter();
  }

  private setupTableHover(): void {
    window.addEventListener('mousemove', (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.renderer.camera);
      const museum = this.scenes[2] as MuseumScene;
      const orbs = museum.tables.map((t) => t.orb);
      const hit = this.raycaster.intersectObjects(orbs).length > 0;
      document.body.style.cursor = hit ? 'pointer' : '';
    });
  }

  private setupTableClicks(): void {
    window.addEventListener('click', (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.renderer.camera);

      const museum = this.scenes[2] as MuseumScene;
      const orbs = museum.tables.map((t) => t.orb);
      const intersects = this.raycaster.intersectObjects(orbs);
      if (intersects.length > 0) {
        const orb = intersects[0].object;
        const idx = orbs.indexOf(orb as typeof orbs[number]);
        this.openTableModal(idx);
        this.audio.playFx('click');
      }
    });
  }

  private openTableModal(idx: number): void {
    const payloads = [
      {
        title: 'Orion Bots',
        tagline: 'Plataforma multi-tenant de bots WhatsApp com IA',
        body: 'SaaS para empresas automatizarem atendimento via WhatsApp. Multi-tenant, integração com IA conversacional, painel de gestão completo.',
        ctaLabel: 'Visitar →',
        ctaUrl: 'https://orionbots.com.br'
      },
      {
        title: 'Lumi Assessora',
        tagline: 'Assistente financeira pessoal com IA',
        body: 'Aplicativo que ajuda pessoas a organizarem suas finanças via conversa natural no WhatsApp. Categorização automática, orçamentos, metas e cartões.',
        ctaLabel: 'Visitar →',
        ctaUrl: 'https://lumiacessora.com.br'
      },
      {
        title: 'Huge ML',
        tagline: 'SaaS para integração com Mercado Livre',
        body: 'Plataforma para vendedores do Mercado Livre automatizarem anúncios, perguntas, vendas, reputação e financeiro. Multi-loja, multi-categoria.',
        ctaLabel: 'Visitar →',
        ctaUrl: 'https://hugeml.com.br'
      }
    ];
    this.modal.open(payloads[idx]);
  }

  private setupKeyboard(): void {
    window.addEventListener('keydown', (e) => {
      const sectionIds = ['scroll-hero', 'scroll-about', 'scroll-museum', 'scroll-stack', 'scroll-contact'];
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = Math.min(this.currentSceneIndex + 1, sectionIds.length - 1);
        document.getElementById(sectionIds[next])?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prev = Math.max(this.currentSceneIndex - 1, 0);
        document.getElementById(sectionIds[prev])?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    });
  }

  private tick = (): void => {
    this.rafId = requestAnimationFrame(this.tick);
    const delta = this.renderer.clock.getDelta();
    this.scenes[this.currentSceneIndex]?.update(delta);
    this.renderer.render();
  };

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
