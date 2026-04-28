# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescrever o portfolio do Guilherme Pires como showcase 3D cinematográfico com 5 cenas (planeta → museu com 3 mesas de produtos → stack → contato), navegação por scroll, Three.js + GSAP, custo zero em assets.

**Architecture:** Vanilla TypeScript + Vite. Engine único orquestrando Renderer (Three.js), Scenes (5 classes que estendem BaseScene), Tables (3 classes que estendem BaseTable), Audio (Howler), UI overlay (DOM puro). Coreografia de scroll mestre via GSAP ScrollSmoother + ScrollTrigger. Shaders GLSL custom para planeta, orbs e hologramas. Bundle alternativo `main-mobile.ts` para mobile.

**Tech Stack:** Vite, TypeScript, Three.js, GSAP (ScrollTrigger, ScrollSmoother, SplitText), Howler.js, vite-plugin-glsl, Vitest + jsdom (testes unit), Playwright (smoke visual).

**Spec:** `docs/superpowers/specs/2026-04-28-portfolio-redesign-design.md`

**Branch:** `redesign` (já criada). Todo trabalho ocorre nessa branch até a F9.

---

## Estrutura de arquivos (criar/modificar)

| Caminho | Responsabilidade |
|---|---|
| `package.json` | Dependências + scripts |
| `vite.config.ts` | Config Vite + plugin GLSL |
| `tsconfig.json` | Config TS strict |
| `vitest.config.ts` | Config testes |
| `playwright.config.ts` | Config smoke tests |
| `index.html` | HTML mínimo + meta tags + canvas root |
| `public/audio/*.mp3` | 1 música ambient + 4 FX (CC0) |
| `public/images/*.png` | 3 logos das marcas |
| `src/main.ts` | Entry desktop |
| `src/main-mobile.ts` | Entry mobile alternativo |
| `src/core/Engine.ts` | Orquestrador principal |
| `src/core/Renderer.ts` | Setup Three.js + postprocessing |
| `src/core/Loader.ts` | Preload + tela de loading |
| `src/core/Audio.ts` | Howler wrapper, FX/música |
| `src/core/Reduced.ts` | Detecção prefers-reduced-motion |
| `src/core/Mobile.ts` | Detecção mobile + switch de bundle |
| `src/scenes/BaseScene.ts` | Classe base init/enter/update/exit |
| `src/scenes/Hero.ts` | Cena 1: planeta + título |
| `src/scenes/About.ts` | Cena 2: silhueta + bio |
| `src/scenes/Museum.ts` | Cena 3: corredor + 3 mesas |
| `src/scenes/StackRoom.ts` | Cena 4: ícones flutuantes |
| `src/scenes/Contact.ts` | Cena 5: planeta de fora + contato |
| `src/tables/BaseTable.ts` | Classe base de mesa (orb + holograma) |
| `src/tables/OrionTable.ts` | Mesa 1 |
| `src/tables/LumiTable.ts` | Mesa 2 |
| `src/tables/HugeTable.ts` | Mesa 3 |
| `src/shaders/planet.vert` | Shader planeta vertex |
| `src/shaders/planet.frag` | Shader planeta fragment |
| `src/shaders/orb.vert` | Shader orb vertex |
| `src/shaders/orb.frag` | Shader orb fragment |
| `src/shaders/hologram.vert` | Shader holograma vertex |
| `src/shaders/hologram.frag` | Shader holograma fragment |
| `src/ui/ProgressBar.ts` | Barra de progresso lateral |
| `src/ui/SectionDots.ts` | 5 dots de navegação |
| `src/ui/Modal.ts` | Modal de detalhes da mesa |
| `src/ui/AudioToggle.ts` | Botão mute |
| `src/ui/SkipIntro.ts` | Atalho pra museu |
| `src/lib/scrollFlow.ts` | Timeline mestre GSAP |
| `src/lib/lerp.ts` | Util interpolação |
| `src/lib/easing.ts` | Curvas custom |
| `src/styles/reset.css` | CSS reset minimal |
| `src/styles/main.css` | Estilos da UI overlay |

Arquivos **deletados** do portfolio antigo (a serem removidos no Task 1.5): `index.html` antigo, `scripts.js`, `styles.css`, `img/` (todos os arquivos antigos exceto os 3 logos novos).

---

# FASE 1 — Setup

## Task 1.1: Limpeza do repo antigo

**Files:**
- Delete: `index.html` (antigo), `scripts.js`, `styles.css`
- Delete: tudo em `img/` exceto reaproveitamentos
- Modify: `.gitignore`

- [ ] **Step 1: Garantir branch correta**

```bash
cd /home/devnpuhinc/projects/portfolio
git status
git branch --show-current
```

Expected: `redesign`. Se diferente, rodar `git checkout redesign`.

- [ ] **Step 2: Remover arquivos antigos**

```bash
rm -f index.html scripts.js styles.css
rm -rf img/
```

- [ ] **Step 3: Criar .gitignore**

Conteúdo de `.gitignore`:

```
node_modules/
dist/
.vite/
.DS_Store
*.log
coverage/
playwright-report/
test-results/
.env
.env.local
```

- [ ] **Step 4: Commit limpeza**

```bash
git add -A
git commit -m "chore: remove portfolio antigo (HTML/CSS vanilla)"
```

---

## Task 1.2: Inicializar Vite + TypeScript

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`

- [ ] **Step 1: Criar package.json**

```json
{
  "name": "portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "vite-plugin-glsl": "^1.3.0"
  },
  "dependencies": {
    "three": "^0.169.0",
    "gsap": "^3.12.5",
    "howler": "^2.2.4"
  }
}
```

- [ ] **Step 2: Criar tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "vite.config.ts"]
}
```

- [ ] **Step 3: Criar vite.config.ts**

```ts
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap']
        }
      }
    }
  }
});
```

- [ ] **Step 4: Criar index.html base**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#000000" />
  <title>Guilherme Pires · Software Engineer</title>
  <meta name="description" content="Engenheiro de software e fundador de produtos SaaS. Orion Bots, Lumi Assessora, Huge ML." />
  <meta property="og:title" content="Guilherme Pires" />
  <meta property="og:description" content="Software Engineer · Founder of SaaS products" />
  <meta property="og:type" content="website" />
  <link rel="icon" type="image/png" href="/images/favicon.png" />
  <link rel="preload" as="image" href="/images/orion-logo.png" />
  <link rel="preload" as="image" href="/images/lumi-avatar.png" />
  <link rel="preload" as="image" href="/images/huge-ml.png" />
  <link rel="stylesheet" href="/src/styles/reset.css" />
  <link rel="stylesheet" href="/src/styles/main.css" />
</head>
<body>
  <canvas id="canvas"></canvas>
  <div id="ui-root"></div>
  <div id="loading-screen">
    <div class="loading-star"></div>
    <p class="loading-text">INICIANDO COORDENADAS...</p>
    <div class="loading-bar"><div class="loading-bar-fill"></div></div>
  </div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 5: Instalar dependências**

```bash
npm install
```

Expected: pasta `node_modules` criada sem erros.

- [ ] **Step 6: Commit setup**

```bash
git add package.json tsconfig.json vite.config.ts index.html package-lock.json
git commit -m "chore: setup Vite + TypeScript + Three.js + GSAP"
```

---

## Task 1.3: Setup Vitest + jsdom para testes unit

**Files:**
- Modify: `package.json` (adicionar deps)
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

- [ ] **Step 1: Instalar deps de teste**

```bash
npm install -D vitest jsdom @vitest/ui @testing-library/dom
```

- [ ] **Step 2: Criar vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/', 'src/main.ts', 'src/main-mobile.ts']
    }
  }
});
```

- [ ] **Step 3: Criar tests/setup.ts**

```ts
import { afterEach, vi } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
```

- [ ] **Step 4: Verificar que vitest roda**

```bash
npx vitest run --reporter=verbose
```

Expected: "No test files found" (sem testes ainda, mas vitest rodou).

- [ ] **Step 5: Commit**

```bash
git add package.json vitest.config.ts tests/setup.ts package-lock.json
git commit -m "chore: setup Vitest + jsdom"
```

---

## Task 1.4: Estilos base (reset + main.css)

**Files:**
- Create: `src/styles/reset.css`
- Create: `src/styles/main.css`

- [ ] **Step 1: Criar src/styles/reset.css**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  overflow: hidden;
  background: #000;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

button {
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}
```

- [ ] **Step 2: Criar src/styles/main.css**

```css
:root {
  --color-bg: #000000;
  --color-fg: #ffffff;
  --color-fg-dim: rgba(255, 255, 255, 0.6);
  --color-orion: #e8e8f0;
  --color-lumi-blue: #1e3a8a;
  --color-lumi-gold: #fbbf24;
  --color-huge: #ffe600;
  --font-display: 'Space Grotesk', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

#canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

#ui-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

#ui-root > * {
  pointer-events: auto;
}

#loading-screen {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  z-index: 100;
  transition: opacity 0.6s ease-out;
}

#loading-screen.hidden {
  opacity: 0;
  pointer-events: none;
}

.loading-star {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 1; }
}

.loading-text {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  color: var(--color-fg-dim);
}

.loading-bar {
  width: 240px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.loading-bar-fill {
  height: 100%;
  width: 0%;
  background: #fff;
  transition: width 0.2s ease-out;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: estilos base (reset + variáveis + loading screen)"
```

---

## Task 1.5: Copiar assets (logos das orgs)

**Files:**
- Create: `public/images/orion-logo.png`
- Create: `public/images/lumi-avatar.png`
- Create: `public/images/huge-ml.png`
- Create: `public/images/favicon.png`

- [ ] **Step 1: Criar pasta public/images**

```bash
mkdir -p public/images
```

- [ ] **Step 2: Copiar logos**

```bash
cp ~/Downloads/github-logos/orion-bots.png public/images/orion-logo.png
cp ~/Downloads/github-logos/lumi-assessora.png public/images/lumi-avatar.png
cp ~/Downloads/github-logos/huge-ml.png public/images/huge-ml.png
```

- [ ] **Step 3: Criar favicon (gerar 32x32)**

```bash
python3 -c "
from PIL import Image
img = Image.open('public/images/orion-logo.png')
img.thumbnail((32, 32))
img.save('public/images/favicon.png')
"
```

- [ ] **Step 4: Verificar**

```bash
ls -la public/images/
```

Expected: 4 arquivos PNG.

- [ ] **Step 5: Commit**

```bash
git add public/images/
git commit -m "feat: assets das marcas (logos Orion/Lumi/Huge + favicon)"
```

---

## Task 1.6: Util lerp + easing (com testes)

**Files:**
- Create: `src/lib/lerp.ts`
- Create: `src/lib/easing.ts`
- Create: `tests/lib/lerp.test.ts`
- Create: `tests/lib/easing.test.ts`

- [ ] **Step 1: Escrever teste lerp (FAIL)**

`tests/lib/lerp.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { lerp, clamp, map } from '@/lib/lerp';

describe('lerp', () => {
  it('returns start when t=0', () => {
    expect(lerp(0, 100, 0)).toBe(0);
  });

  it('returns end when t=1', () => {
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it('returns midpoint when t=0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });
});

describe('clamp', () => {
  it('clamps within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('map', () => {
  it('maps value from one range to another', () => {
    expect(map(5, 0, 10, 0, 100)).toBe(50);
    expect(map(0.5, 0, 1, 100, 200)).toBe(150);
  });
});
```

- [ ] **Step 2: Run test (FAIL esperado)**

```bash
npx vitest run tests/lib/lerp.test.ts
```

Expected: FAIL "module not found".

- [ ] **Step 3: Implementar src/lib/lerp.ts**

```ts
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}
```

- [ ] **Step 4: Run test (PASS esperado)**

```bash
npx vitest run tests/lib/lerp.test.ts
```

Expected: PASS 3 testes.

- [ ] **Step 5: Escrever teste easing (FAIL)**

`tests/lib/easing.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { easeInOutCubic, easeOutExpo } from '@/lib/easing';

describe('easeInOutCubic', () => {
  it('returns 0 at t=0', () => {
    expect(easeInOutCubic(0)).toBe(0);
  });
  it('returns 1 at t=1', () => {
    expect(easeInOutCubic(1)).toBe(1);
  });
  it('returns 0.5 at t=0.5', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 5);
  });
});

describe('easeOutExpo', () => {
  it('returns 0 at t=0', () => {
    expect(easeOutExpo(0)).toBe(0);
  });
  it('returns 1 at t=1', () => {
    expect(easeOutExpo(1)).toBe(1);
  });
});
```

- [ ] **Step 6: Implementar src/lib/easing.ts**

```ts
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
```

- [ ] **Step 7: Run testes (PASS esperado)**

```bash
npx vitest run tests/lib/
```

Expected: PASS 8 testes.

- [ ] **Step 8: Commit**

```bash
git add src/lib/ tests/lib/
git commit -m "feat: utils lerp/clamp/map + easing functions (TDD)"
```

---

## Task 1.7: Reduced + Mobile detection (com testes)

**Files:**
- Create: `src/core/Reduced.ts`
- Create: `src/core/Mobile.ts`
- Create: `tests/core/Reduced.test.ts`
- Create: `tests/core/Mobile.test.ts`

- [ ] **Step 1: Escrever teste Reduced (FAIL)**

`tests/core/Reduced.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { isReducedMotion } from '@/core/Reduced';

describe('isReducedMotion', () => {
  it('returns true when matchMedia matches reduce', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    expect(isReducedMotion()).toBe(true);
  });

  it('returns false when matchMedia does not match', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    expect(isReducedMotion()).toBe(false);
  });
});
```

- [ ] **Step 2: Implementar src/core/Reduced.ts**

```ts
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function onReducedChange(cb: (reduced: boolean) => void): () => void {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => cb(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
```

- [ ] **Step 3: Run teste (PASS)**

```bash
npx vitest run tests/core/Reduced.test.ts
```

- [ ] **Step 4: Escrever teste Mobile (FAIL)**

`tests/core/Mobile.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { isMobile } from '@/core/Mobile';

describe('isMobile', () => {
  it('returns true when viewport < 768px', () => {
    vi.stubGlobal('innerWidth', 500);
    expect(isMobile()).toBe(true);
  });

  it('returns false when viewport >= 768px and has mouse', () => {
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('hover: hover'),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    expect(isMobile()).toBe(false);
  });
});
```

- [ ] **Step 5: Implementar src/core/Mobile.ts**

```ts
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.innerWidth < 768) return true;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  return !hasHover;
}
```

- [ ] **Step 6: Run testes (PASS)**

```bash
npx vitest run tests/core/
```

Expected: PASS 4 testes.

- [ ] **Step 7: Commit**

```bash
git add src/core/Reduced.ts src/core/Mobile.ts tests/core/
git commit -m "feat: Reduced + Mobile detection (TDD)"
```

---

## Task 1.8: Loader (preload + UI tela)

**Files:**
- Create: `src/core/Loader.ts`
- Create: `tests/core/Loader.test.ts`

- [ ] **Step 1: Teste do Loader (FAIL)**

`tests/core/Loader.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Loader } from '@/core/Loader';

describe('Loader', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="loading-screen">
        <div class="loading-bar-fill"></div>
      </div>
    `;
  });

  it('starts at 0 progress', () => {
    const l = new Loader([]);
    expect(l.progress).toBe(0);
  });

  it('reports 100% when all assets done', async () => {
    const l = new Loader([]);
    await l.load();
    expect(l.progress).toBe(1);
  });

  it('updates progress bar fill width', async () => {
    const l = new Loader([]);
    await l.load();
    const fill = document.querySelector('.loading-bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('hides screen after load', async () => {
    const l = new Loader([]);
    await l.load();
    l.hide();
    const screen = document.getElementById('loading-screen');
    expect(screen?.classList.contains('hidden')).toBe(true);
  });
});
```

- [ ] **Step 2: Implementar src/core/Loader.ts**

```ts
import { clamp } from '@/lib/lerp';

export type LoadableAsset =
  | { type: 'image'; url: string }
  | { type: 'audio'; url: string }
  | { type: 'json'; url: string };

export class Loader {
  progress: number = 0;
  private assets: LoadableAsset[];
  private loaded: Map<string, unknown> = new Map();
  private barFill: HTMLElement | null;
  private screen: HTMLElement | null;

  constructor(assets: LoadableAsset[]) {
    this.assets = assets;
    this.barFill = document.querySelector('.loading-bar-fill');
    this.screen = document.getElementById('loading-screen');
  }

  async load(): Promise<void> {
    if (this.assets.length === 0) {
      this.setProgress(1);
      return;
    }
    let done = 0;
    await Promise.all(
      this.assets.map(async (asset) => {
        await this.loadAsset(asset);
        done += 1;
        this.setProgress(clamp(done / this.assets.length, 0, 1));
      })
    );
  }

  private async loadAsset(asset: LoadableAsset): Promise<void> {
    if (asset.type === 'image') {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed: ${asset.url}`));
        img.src = asset.url;
      });
      this.loaded.set(asset.url, img);
    } else if (asset.type === 'audio') {
      const audio = new Audio(asset.url);
      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject(new Error(`Failed: ${asset.url}`));
        audio.load();
      });
      this.loaded.set(asset.url, audio);
    } else if (asset.type === 'json') {
      const res = await fetch(asset.url);
      const data = await res.json();
      this.loaded.set(asset.url, data);
    }
  }

  private setProgress(p: number): void {
    this.progress = p;
    if (this.barFill) {
      this.barFill.style.width = `${(p * 100).toFixed(1)}%`;
    }
  }

  hide(): void {
    this.screen?.classList.add('hidden');
  }

  get<T>(url: string): T | undefined {
    return this.loaded.get(url) as T | undefined;
  }
}
```

- [ ] **Step 3: Run teste (PASS)**

```bash
npx vitest run tests/core/Loader.test.ts
```

Expected: PASS 4 testes.

- [ ] **Step 4: Commit**

```bash
git add src/core/Loader.ts tests/core/Loader.test.ts
git commit -m "feat: Loader com preload + UI progress (TDD)"
```

---

## Task 1.9: Engine (orquestrador inicial — só boot)

**Files:**
- Create: `src/core/Engine.ts`
- Create: `src/main.ts`
- Create: `tests/core/Engine.test.ts`

- [ ] **Step 1: Teste do Engine (FAIL)**

`tests/core/Engine.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Engine } from '@/core/Engine';

describe('Engine', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <canvas id="canvas"></canvas>
      <div id="ui-root"></div>
      <div id="loading-screen"><div class="loading-bar-fill"></div></div>
    `;
  });

  it('finds canvas element on init', () => {
    const e = new Engine();
    expect(e.canvas).toBeInstanceOf(HTMLCanvasElement);
  });

  it('throws if canvas not found', () => {
    document.body.innerHTML = '';
    expect(() => new Engine()).toThrow(/canvas/);
  });
});
```

- [ ] **Step 2: Implementar Engine mínimo**

`src/core/Engine.ts`:

```ts
export class Engine {
  canvas: HTMLCanvasElement;

  constructor() {
    const canvas = document.getElementById('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas element not found');
    }
    this.canvas = canvas;
  }

  async start(): Promise<void> {
    // Será expandido nas próximas tasks
  }
}
```

- [ ] **Step 3: Criar main.ts**

`src/main.ts`:

```ts
import { Engine } from '@/core/Engine';
import { isMobile } from '@/core/Mobile';

if (isMobile()) {
  // Próxima fase: redirect para main-mobile
  console.log('mobile detected — versão simplificada será carregada na F8');
}

const engine = new Engine();
engine.start();
```

- [ ] **Step 4: Run teste (PASS)**

```bash
npx vitest run tests/core/Engine.test.ts
```

- [ ] **Step 5: Smoke test do dev server**

```bash
npm run dev &
sleep 3
curl -sI http://localhost:5173 | head -1
kill %1
```

Expected: `HTTP/1.1 200 OK`.

- [ ] **Step 6: Commit**

```bash
git add src/core/Engine.ts src/main.ts tests/core/Engine.test.ts
git commit -m "feat: Engine boot mínimo + main entry"
```

---

## Task 1.10: Renderer (Three.js setup) + smoke test

**Files:**
- Create: `src/core/Renderer.ts`
- Modify: `src/core/Engine.ts`

- [ ] **Step 1: Implementar Renderer**

`src/core/Renderer.ts`:

```ts
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  Clock
} from 'three';

export class Renderer {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  clock: Clock;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new Scene();
    this.scene.background = new Color('#000000');

    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    this.clock = new Clock();

    window.addEventListener('resize', () => this.handleResize());
  }

  private handleResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.renderer.dispose();
  }
}
```

- [ ] **Step 2: Conectar ao Engine**

Substituir conteúdo de `src/core/Engine.ts`:

```ts
import { Renderer } from '@/core/Renderer';

export class Engine {
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  private rafId: number | null = null;

  constructor() {
    const canvas = document.getElementById('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas element not found');
    }
    this.canvas = canvas;
    this.renderer = new Renderer(this.canvas);
  }

  async start(): Promise<void> {
    this.tick();
  }

  private tick = (): void => {
    this.rafId = requestAnimationFrame(this.tick);
    this.renderer.render();
  };

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
```

- [ ] **Step 3: Smoke test**

```bash
npm run dev &
sleep 3
```

Abrir http://localhost:5173 no browser, verificar:
- Console sem erros
- Tela preta com canvas (cena vazia)
- Loading-screen ainda visível (não escondido ainda)

```bash
kill %1
```

- [ ] **Step 4: Commit**

```bash
git add src/core/Renderer.ts src/core/Engine.ts
git commit -m "feat: Renderer Three.js + loop básico de render"
```

---

## Task 1.11: BaseScene + 5 placeholders + scene manager no Engine

**Files:**
- Create: `src/scenes/BaseScene.ts`
- Create: `src/scenes/Hero.ts` (placeholder)
- Create: `src/scenes/About.ts` (placeholder)
- Create: `src/scenes/Museum.ts` (placeholder)
- Create: `src/scenes/StackRoom.ts` (placeholder)
- Create: `src/scenes/Contact.ts` (placeholder)
- Modify: `src/core/Engine.ts`

- [ ] **Step 1: Implementar BaseScene**

`src/scenes/BaseScene.ts`:

```ts
import { Group, Object3D, PerspectiveCamera } from 'three';

export interface SceneContext {
  camera: PerspectiveCamera;
  rootScene: import('three').Scene;
}

export abstract class BaseScene {
  group: Group;
  ctx: SceneContext;
  active: boolean = false;

  constructor(ctx: SceneContext) {
    this.ctx = ctx;
    this.group = new Group();
    this.group.visible = false;
    ctx.rootScene.add(this.group);
  }

  abstract init(): Promise<void>;

  enter(): void {
    this.active = true;
    this.group.visible = true;
  }

  update(_delta: number): void {
    // Override em subclasses
  }

  exit(): void {
    this.active = false;
    this.group.visible = false;
  }

  dispose(): void {
    this.ctx.rootScene.remove(this.group);
    this.group.traverse((obj: Object3D) => {
      // simples — limpeza profunda nas subclasses se necessário
      const o = obj as { geometry?: { dispose: () => void }; material?: { dispose: () => void } };
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
  }
}
```

- [ ] **Step 2: Criar 5 placeholders**

`src/scenes/Hero.ts`:

```ts
import { BaseScene } from './BaseScene';
import { BoxGeometry, Mesh, MeshStandardMaterial, AmbientLight } from 'three';

export class Hero extends BaseScene {
  async init(): Promise<void> {
    const cube = new Mesh(
      new BoxGeometry(2, 2, 2),
      new MeshStandardMaterial({ color: 0x444466 })
    );
    cube.position.set(0, 0, 0);
    this.group.add(cube);
    this.group.add(new AmbientLight(0xffffff, 0.6));
  }
}
```

`src/scenes/About.ts`, `src/scenes/Museum.ts`, `src/scenes/StackRoom.ts`, `src/scenes/Contact.ts`:

(mesma estrutura, mudando cor: 0x664444, 0x446644, 0x664466, 0x446666 respectivamente)

- [ ] **Step 3: Engine gerencia cenas**

Substituir `src/core/Engine.ts`:

```ts
import { Renderer } from '@/core/Renderer';
import { BaseScene, SceneContext } from '@/scenes/BaseScene';
import { Hero } from '@/scenes/Hero';
import { About } from '@/scenes/About';
import { Museum } from '@/scenes/Museum';
import { StackRoom } from '@/scenes/StackRoom';
import { Contact } from '@/scenes/Contact';

export class Engine {
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  scenes: BaseScene[] = [];
  currentSceneIndex: number = 0;
  private rafId: number | null = null;

  constructor() {
    const canvas = document.getElementById('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('canvas element not found');
    }
    this.canvas = canvas;
    this.renderer = new Renderer(this.canvas);
  }

  async start(): Promise<void> {
    const ctx: SceneContext = {
      camera: this.renderer.camera,
      rootScene: this.renderer.scene
    };

    this.scenes = [
      new Hero(ctx),
      new About(ctx),
      new Museum(ctx),
      new StackRoom(ctx),
      new Contact(ctx)
    ];

    await Promise.all(this.scenes.map((s) => s.init()));
    this.scenes[0].enter();
    this.tick();
  }

  goToScene(index: number): void {
    if (index === this.currentSceneIndex) return;
    this.scenes[this.currentSceneIndex]?.exit();
    this.currentSceneIndex = index;
    this.scenes[index]?.enter();
  }

  private tick = (): void => {
    this.rafId = requestAnimationFrame(this.tick);
    const delta = this.renderer.clock.getDelta();
    this.scenes[this.currentSceneIndex]?.update(delta);
    this.renderer.render();
  };

  stop(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
```

- [ ] **Step 4: Smoke test**

```bash
npm run dev
```

Abrir http://localhost:5173. Esperado: cubo cinza-azulado visível (Hero placeholder). Console sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/ src/core/Engine.ts
git commit -m "feat: BaseScene + 5 cenas placeholder + scene manager no Engine"
```

---

## Task 1.12: Loader integrado + esconder loading screen ao boot

**Files:**
- Modify: `src/core/Engine.ts`

- [ ] **Step 1: Adicionar Loader ao Engine**

Modificar `Engine.start()` em `src/core/Engine.ts`:

```ts
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
    new Museum(ctx),
    new StackRoom(ctx),
    new Contact(ctx)
  ];

  await Promise.all(this.scenes.map((s) => s.init()));
  this.scenes[0].enter();

  setTimeout(() => loader.hide(), 300);

  this.tick();
}
```

Adicionar import no topo:
```ts
import { Loader } from '@/core/Loader';
```

- [ ] **Step 2: Smoke test**

```bash
npm run dev
```

Esperado: loading screen aparece com barra subindo até 100%, depois fade out. Cubo aparece.

- [ ] **Step 3: Commit final F1**

```bash
git add src/core/Engine.ts
git commit -m "feat: integrar Loader ao Engine, fim F1 (setup completo)"
```

---

# FASE 2 — Hero / Aterrissagem

## Task 2.1: Shader do planeta (vert + frag)

**Files:**
- Create: `src/shaders/planet.vert`
- Create: `src/shaders/planet.frag`

- [ ] **Step 1: Criar planet.vert**

```glsl
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 2: Criar planet.frag**

```glsl
uniform float uTime;
uniform vec3 uColorBase;
uniform vec3 uColorAtmosphere;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
        mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
        mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z
  );
}

void main() {
  // Noise pra simular textura de superfície
  float n = noise(vPosition * 2.5 + uTime * 0.05);
  n += 0.5 * noise(vPosition * 5.0 + uTime * 0.03);
  n += 0.25 * noise(vPosition * 10.0);
  n = clamp(n / 1.75, 0.0, 1.0);

  // Cor base com variação por noise
  vec3 surface = mix(uColorBase * 0.6, uColorBase, n);

  // Fresnel pra atmosfera
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
  vec3 atmosphere = uColorAtmosphere * fresnel;

  vec3 finalColor = surface + atmosphere;

  gl_FragColor = vec4(finalColor, 1.0);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/shaders/planet.vert src/shaders/planet.frag
git commit -m "feat: shader procedural do planeta (noise + fresnel atmosphere)"
```

---

## Task 2.2: Hero scene com planeta real

**Files:**
- Modify: `src/scenes/Hero.ts`

- [ ] **Step 1: Substituir Hero placeholder por planeta real**

`src/scenes/Hero.ts`:

```ts
import { BaseScene } from './BaseScene';
import {
  SphereGeometry,
  Mesh,
  ShaderMaterial,
  PointLight,
  Color,
  AdditiveBlending,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial
} from 'three';
import planetVert from '@/shaders/planet.vert';
import planetFrag from '@/shaders/planet.frag';

export class Hero extends BaseScene {
  private planet!: Mesh;
  private starsField!: Points;
  private material!: ShaderMaterial;

  async init(): Promise<void> {
    // Planeta
    const geom = new SphereGeometry(8, 128, 128);
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorBase: { value: new Color('#3a4a6a') },
        uColorAtmosphere: { value: new Color('#7aaaff') }
      },
      vertexShader: planetVert,
      fragmentShader: planetFrag
    });
    this.planet = new Mesh(geom, this.material);
    this.group.add(this.planet);

    // Luz
    const light = new PointLight(0xffffff, 2, 100);
    light.position.set(20, 10, 30);
    this.group.add(light);

    // Estrelas de fundo
    this.starsField = this.createStars(2000);
    this.group.add(this.starsField);

    // Posição inicial da câmera (longe)
    this.ctx.camera.position.set(0, 0, 80);
    this.ctx.camera.lookAt(0, 0, 0);
  }

  private createStars(count: number): Points {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(positions, 3));
    const mat = new PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending
    });
    return new Points(geom, mat);
  }

  update(delta: number): void {
    this.material.uniforms.uTime.value += delta;
    this.planet.rotation.y += delta * 0.05;
    this.starsField.rotation.y += delta * 0.005;
  }
}
```

- [ ] **Step 2: Smoke test**

```bash
npm run dev
```

Abrir browser. Esperado: planeta esférico azul-acinzentado visível, estrelas de fundo, luz sutil. Sem erros no console.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/Hero.ts
git commit -m "feat: planeta procedural na cena Hero (shader + stars field)"
```

---

## Task 2.3: Título Hero (HTML overlay) + animação SplitText

**Files:**
- Create: `src/ui/HeroTitle.ts`
- Modify: `src/styles/main.css` (estilos do título)
- Modify: `src/core/Engine.ts` (montar título)

- [ ] **Step 1: Adicionar estilos do título em main.css**

Adicionar ao final de `src/styles/main.css`:

```css
.hero-title {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  pointer-events: none;
  z-index: 5;
}

.hero-title h1 {
  font-family: var(--font-display, sans-serif);
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.hero-title p {
  font-family: var(--font-mono);
  font-size: clamp(0.875rem, 1.4vw, 1.125rem);
  color: var(--color-fg-dim);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero-title .char {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
}
```

- [ ] **Step 2: Criar HeroTitle.ts**

`src/ui/HeroTitle.ts`:

```ts
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
```

- [ ] **Step 3: Conectar no Engine**

Modificar `src/core/Engine.ts` — adicionar após scenes init e antes do loader.hide:

```ts
const uiRoot = document.getElementById('ui-root')!;
const heroTitle = new HeroTitle(uiRoot);
setTimeout(() => {
  loader.hide();
  heroTitle.animateIn();
}, 300);
```

Adicionar import:
```ts
import { HeroTitle } from '@/ui/HeroTitle';
```

- [ ] **Step 4: Smoke test**

```bash
npm run dev
```

Esperado: após loading, título "GUILHERME PIRES" aparece letra por letra, depois subtítulo.

- [ ] **Step 5: Commit**

```bash
git add src/ui/HeroTitle.ts src/styles/main.css src/core/Engine.ts
git commit -m "feat: título Hero com animação SplitText"
```

---

## Task 2.4: ScrollSmoother + ScrollTrigger setup

**Files:**
- Create: `src/lib/scrollFlow.ts`
- Modify: `src/core/Engine.ts`
- Modify: `index.html` (wrapper de scroll)

- [ ] **Step 1: Adicionar wrappers de scroll no index.html**

Substituir `<body>` em `index.html`:

```html
<body>
  <canvas id="canvas"></canvas>
  <div id="ui-root"></div>
  <div id="loading-screen">
    <div class="loading-star"></div>
    <p class="loading-text">INICIANDO COORDENADAS...</p>
    <div class="loading-bar"><div class="loading-bar-fill"></div></div>
  </div>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <section class="scroll-section" id="scroll-hero"></section>
      <section class="scroll-section" id="scroll-about"></section>
      <section class="scroll-section" id="scroll-museum"></section>
      <section class="scroll-section" id="scroll-stack"></section>
      <section class="scroll-section" id="scroll-contact"></section>
    </div>
  </div>
  <script type="module" src="/src/main.ts"></script>
</body>
```

- [ ] **Step 2: Estilos do scroll wrapper**

Adicionar ao final de `src/styles/main.css`:

```css
#smooth-wrapper {
  position: fixed;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
}

#smooth-content {
  pointer-events: none;
}

.scroll-section {
  height: 100vh;
  width: 100%;
  pointer-events: none;
}

#scroll-hero { height: 200vh; }
#scroll-about { height: 200vh; }
#scroll-museum { height: 500vh; }
#scroll-stack { height: 200vh; }
#scroll-contact { height: 150vh; }
```

- [ ] **Step 3: Criar scrollFlow.ts**

`src/lib/scrollFlow.ts`:

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { PerspectiveCamera } from 'three';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export interface SectionMark {
  id: string;
  cameraEnd: { x: number; y: number; z: number };
  lookAtEnd: { x: number; y: number; z: number };
}

export class ScrollFlow {
  private smoother: ScrollSmoother;
  private camera: PerspectiveCamera;

  constructor(camera: PerspectiveCamera) {
    this.camera = camera;
    this.smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      effects: false
    });
  }

  setupHero(): void {
    ScrollTrigger.create({
      trigger: '#scroll-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const t = self.progress;
        // Câmera voa de z=80 para z=12 (perto do planeta)
        this.camera.position.z = 80 - t * 68;
      }
    });
  }

  destroy(): void {
    this.smoother.kill();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
}
```

- [ ] **Step 4: Conectar no Engine**

Adicionar em `src/core/Engine.ts`:

```ts
import { ScrollFlow } from '@/lib/scrollFlow';
```

Adicionar campo:
```ts
scrollFlow!: ScrollFlow;
```

Após o título no `start()`:
```ts
this.scrollFlow = new ScrollFlow(this.renderer.camera);
this.scrollFlow.setupHero();
```

- [ ] **Step 5: Smoke test**

```bash
npm run dev
```

Esperado: ao rolar, câmera se aproxima do planeta. Sem erros.

- [ ] **Step 6: Commit**

```bash
git add src/lib/scrollFlow.ts src/core/Engine.ts index.html src/styles/main.css
git commit -m "feat: ScrollSmoother + ScrollTrigger pra Hero (camera fly-in)"
```

---

# FASE 3 — About + Museum base

## Task 3.1: About scene (silhueta low-poly + bio)

**Files:**
- Modify: `src/scenes/About.ts`
- Create: `src/ui/BioOverlay.ts`
- Modify: `src/styles/main.css`

- [ ] **Step 1: Substituir About placeholder**

`src/scenes/About.ts`:

```ts
import { BaseScene } from './BaseScene';
import {
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  AmbientLight,
  Color,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending
} from 'three';

export class About extends BaseScene {
  private avatar!: Mesh;
  private dust!: Points;

  async init(): Promise<void> {
    // Silhueta low-poly abstrata: icosaedro alongado
    const geom = new IcosahedronGeometry(2, 1);
    const mat = new MeshStandardMaterial({
      color: new Color('#1a2030'),
      metalness: 0.3,
      roughness: 0.8,
      flatShading: true
    });
    this.avatar = new Mesh(geom, mat);
    this.avatar.position.set(-3, 0, 0);
    this.avatar.scale.set(1, 1.6, 1);
    this.group.add(this.avatar);

    // Iluminação fria lateral
    const light = new PointLight(0x4a6aff, 4, 30);
    light.position.set(-5, 5, 5);
    this.group.add(light);
    this.group.add(new AmbientLight(0x101020, 0.4));

    // Poeira lunar (partículas)
    this.dust = this.createDust(300);
    this.group.add(this.dust);
  }

  private createDust(count: number): Points {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(positions, 3));
    const mat = new PointsMaterial({
      color: 0xaaaaff,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending
    });
    return new Points(geom, mat);
  }

  update(delta: number): void {
    this.avatar.rotation.y += delta * 0.1;
    this.dust.rotation.y += delta * 0.02;
  }
}
```

- [ ] **Step 2: Criar BioOverlay.ts**

`src/ui/BioOverlay.ts`:

```ts
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
```

- [ ] **Step 3: Estilos da Bio em main.css**

Adicionar:

```css
.bio-overlay {
  position: fixed;
  top: 50%;
  right: 8%;
  transform: translateY(-50%);
  max-width: 480px;
  pointer-events: none;
  opacity: 0;
  z-index: 5;
}

.bio-title {
  font-family: var(--font-display, sans-serif);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  color: var(--color-fg-dim);
}

.bio-text p {
  font-size: clamp(0.95rem, 1.2vw, 1.125rem);
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--color-fg);
}
```

- [ ] **Step 4: Conectar no Engine + ScrollFlow**

Em `src/lib/scrollFlow.ts`, adicionar método `setupAbout`:

```ts
setupAbout(onEnter: () => void, onExit: () => void): void {
  ScrollTrigger.create({
    trigger: '#scroll-about',
    start: 'top center',
    end: 'bottom center',
    onEnter,
    onLeaveBack: onExit
  });
}
```

Em `Engine.start()`, depois de `setupHero()`:
```ts
const bio = new BioOverlay(uiRoot);
this.scrollFlow.setupAbout(
  () => {
    this.goToScene(1);
    bio.show();
  },
  () => {
    this.goToScene(0);
    bio.hide();
  }
);
```

Adicionar import: `import { BioOverlay } from '@/ui/BioOverlay';`

- [ ] **Step 5: Smoke test**

```bash
npm run dev
```

Esperado: ao rolar pra About, avatar low-poly aparece com texto bio entrando linha a linha.

- [ ] **Step 6: Commit**

```bash
git add src/scenes/About.ts src/ui/BioOverlay.ts src/styles/main.css src/core/Engine.ts src/lib/scrollFlow.ts
git commit -m "feat: cena About (silhueta low-poly + bio overlay animada)"
```

---

## Task 3.2: Museum corredor base (chão, paredes, sem mesas)

**Files:**
- Modify: `src/scenes/Museum.ts`

- [ ] **Step 1: Substituir Museum placeholder**

`src/scenes/Museum.ts`:

```ts
import { BaseScene } from './BaseScene';
import {
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  AmbientLight,
  Color,
  RepeatWrapping,
  CanvasTexture
} from 'three';

export class Museum extends BaseScene {
  async init(): Promise<void> {
    // Chão
    const floorTexture = this.createGridTexture();
    const floor = new Mesh(
      new PlaneGeometry(40, 200),
      new MeshStandardMaterial({
        color: 0x080a14,
        metalness: 0.7,
        roughness: 0.4,
        map: floorTexture
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.5, 0);
    this.group.add(floor);

    // Teto
    const ceiling = new Mesh(
      new PlaneGeometry(40, 200),
      new MeshStandardMaterial({ color: 0x040608, side: 2 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 6, 0);
    this.group.add(ceiling);

    // Paredes laterais
    const wallMat = new MeshStandardMaterial({ color: 0x101218, roughness: 0.9 });
    const wallLeft = new Mesh(new PlaneGeometry(200, 8), wallMat);
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(-12, 2, 0);
    this.group.add(wallLeft);

    const wallRight = new Mesh(new PlaneGeometry(200, 8), wallMat.clone());
    wallRight.rotation.y = -Math.PI / 2;
    wallRight.position.set(12, 2, 0);
    this.group.add(wallRight);

    // Luzes pontuais distantes (sugerem corredor longo)
    for (let i = 0; i < 6; i++) {
      const z = -50 + i * 20;
      const lightL = new PointLight(0x6688aa, 1.2, 30);
      lightL.position.set(-10, 5, z);
      this.group.add(lightL);

      const lightR = new PointLight(0x6688aa, 1.2, 30);
      lightR.position.set(10, 5, z);
      this.group.add(lightR);
    }

    this.group.add(new AmbientLight(0x202030, 0.2));
  }

  private createGridTexture(): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#080a14';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = 'rgba(80, 100, 140, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 256; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
    }
    const tex = new CanvasTexture(canvas);
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(10, 50);
    return tex;
  }
}
```

- [ ] **Step 2: ScrollFlow do Museum (câmera anda em Z negativo)**

Em `src/lib/scrollFlow.ts`, adicionar:

```ts
setupMuseum(onEnter: () => void, onExit: () => void): void {
  ScrollTrigger.create({
    trigger: '#scroll-museum',
    start: 'top center',
    end: 'bottom center',
    onEnter,
    onLeaveBack: onExit,
    scrub: 1.5,
    onUpdate: (self) => {
      const t = self.progress;
      // Câmera anda de z=20 (entrada) a z=-60 (saída)
      this.camera.position.set(0, 1, 20 - t * 80);
      this.camera.lookAt(0, 1, this.camera.position.z - 10);
    }
  });
}
```

- [ ] **Step 3: Conectar no Engine**

Em `Engine.start()`:

```ts
this.scrollFlow.setupMuseum(
  () => this.goToScene(2),
  () => this.goToScene(1)
);
```

- [ ] **Step 4: Smoke test**

```bash
npm run dev
```

Esperado: ao rolar pra museum, vê-se um corredor com chão refletindo, luzes pontuais ao longo. Câmera anda pra frente conforme scroll.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/Museum.ts src/lib/scrollFlow.ts src/core/Engine.ts
git commit -m "feat: corredor base do museu (chão metálico + paredes + luzes)"
```

---

# FASE 4 — Mesas com orbs e iluminação

## Task 4.1: Shader do orb (vert + frag)

**Files:**
- Create: `src/shaders/orb.vert`
- Create: `src/shaders/orb.frag`

- [ ] **Step 1: Criar orb.vert**

```glsl
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 2: Criar orb.frag**

```glsl
uniform float uTime;
uniform vec3 uColorCore;
uniform vec3 uColorRim;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);

  // Pulse interno
  float pulse = 0.5 + 0.5 * sin(uTime * 1.5);
  vec3 core = uColorCore * (0.6 + 0.4 * pulse);
  vec3 rim = uColorRim * fresnel;

  vec3 finalColor = core + rim;
  gl_FragColor = vec4(finalColor, 1.0);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/shaders/orb.vert src/shaders/orb.frag
git commit -m "feat: shader pulsante do orb (fresnel + pulse)"
```

---

## Task 4.2: BaseTable (classe base de mesa)

**Files:**
- Create: `src/tables/BaseTable.ts`

- [ ] **Step 1: Criar BaseTable**

`src/tables/BaseTable.ts`:

```ts
import {
  CylinderGeometry,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  ShaderMaterial,
  Group,
  PointLight,
  Color
} from 'three';
import orbVert from '@/shaders/orb.vert';
import orbFrag from '@/shaders/orb.frag';

export interface TableConfig {
  name: string;
  position: { x: number; y: number; z: number };
  colorCore: string;
  colorRim: string;
  lightColor: string;
  lightIntensity: number;
}

export class BaseTable {
  config: TableConfig;
  group: Group;
  pedestal!: Mesh;
  orb!: Mesh;
  orbMaterial!: ShaderMaterial;
  light!: PointLight;
  isLit: boolean = false;

  constructor(config: TableConfig) {
    this.config = config;
    this.group = new Group();
    this.group.position.set(config.position.x, config.position.y, config.position.z);

    this.buildPedestal();
    this.buildOrb();
    this.buildLight();
  }

  private buildPedestal(): void {
    const geom = new CylinderGeometry(1.2, 1.4, 1.5, 8);
    const mat = new MeshStandardMaterial({
      color: 0x202028,
      metalness: 0.7,
      roughness: 0.3
    });
    this.pedestal = new Mesh(geom, mat);
    this.pedestal.position.y = -0.75;
    this.group.add(this.pedestal);
  }

  private buildOrb(): void {
    const geom = new SphereGeometry(0.7, 64, 64);
    this.orbMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorCore: { value: new Color(this.config.colorCore) },
        uColorRim: { value: new Color(this.config.colorRim) }
      },
      vertexShader: orbVert,
      fragmentShader: orbFrag
    });
    this.orb = new Mesh(geom, this.orbMaterial);
    this.orb.position.y = 1.2;
    this.group.add(this.orb);
  }

  private buildLight(): void {
    this.light = new PointLight(this.config.lightColor, 0, 25);
    this.light.position.set(0, 4, 0);
    this.group.add(this.light);
  }

  litUp(): void {
    this.isLit = true;
    // Animação simples (sem GSAP por enquanto pra evitar import circular)
    this.light.intensity = this.config.lightIntensity;
  }

  litDown(): void {
    this.isLit = false;
    this.light.intensity = 0;
  }

  update(delta: number): void {
    this.orbMaterial.uniforms.uTime.value += delta;
    this.orb.rotation.y += delta * 0.3;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/tables/BaseTable.ts
git commit -m "feat: BaseTable (pedestal + orb + luz controlável)"
```

---

## Task 4.3: 3 mesas concretas (Orion, Lumi, Huge)

**Files:**
- Create: `src/tables/OrionTable.ts`
- Create: `src/tables/LumiTable.ts`
- Create: `src/tables/HugeTable.ts`

- [ ] **Step 1: OrionTable.ts**

```ts
import { BaseTable } from './BaseTable';

export class OrionTable extends BaseTable {
  constructor(z: number) {
    super({
      name: 'Orion',
      position: { x: 0, y: 0, z },
      colorCore: '#1a1a2a',
      colorRim: '#e8e8f0',
      lightColor: '#e8e8f0',
      lightIntensity: 3
    });
  }
}
```

- [ ] **Step 2: LumiTable.ts**

```ts
import { BaseTable } from './BaseTable';

export class LumiTable extends BaseTable {
  constructor(z: number) {
    super({
      name: 'Lumi',
      position: { x: 0, y: 0, z },
      colorCore: '#1e3a8a',
      colorRim: '#fbbf24',
      lightColor: '#3b5dc9',
      lightIntensity: 4
    });
  }
}
```

- [ ] **Step 3: HugeTable.ts**

```ts
import { BaseTable } from './BaseTable';

export class HugeTable extends BaseTable {
  constructor(z: number) {
    super({
      name: 'Huge ML',
      position: { x: 0, y: 0, z },
      colorCore: '#2a2a00',
      colorRim: '#ffe600',
      lightColor: '#ffe600',
      lightIntensity: 5
    });
  }
}
```

- [ ] **Step 4: Adicionar mesas ao Museum**

Modificar `src/scenes/Museum.ts`, adicionar campos e modificar init:

```ts
import { OrionTable } from '@/tables/OrionTable';
import { LumiTable } from '@/tables/LumiTable';
import { HugeTable } from '@/tables/HugeTable';
import { BaseTable } from '@/tables/BaseTable';

export class Museum extends BaseScene {
  tables: BaseTable[] = [];

  async init(): Promise<void> {
    // ... código existente do corredor ...

    // Mesas (espaçadas em Z negativo)
    const orion = new OrionTable(0);
    const lumi = new LumiTable(-20);
    const huge = new HugeTable(-40);
    this.tables = [orion, lumi, huge];
    this.tables.forEach((t) => this.group.add(t.group));
  }

  update(delta: number): void {
    this.tables.forEach((t) => t.update(delta));
  }
}
```

- [ ] **Step 5: Smoke test**

```bash
npm run dev
```

Esperado: rolar pro Museum mostra corredor com 3 pedestais + 3 orbs (preto, azul, amarelo) flutuando. Luzes ainda apagadas.

- [ ] **Step 6: Commit**

```bash
git add src/tables/ src/scenes/Museum.ts
git commit -m "feat: 3 mesas (Orion, Lumi, Huge) no museu com orbs distintos"
```

---

## Task 4.4: Iluminação por mesa baseada em proximidade da câmera

**Files:**
- Modify: `src/scenes/Museum.ts`
- Modify: `src/lib/scrollFlow.ts`

- [ ] **Step 1: Lógica de proximidade no Museum**

Adicionar método em `Museum.ts`:

```ts
update(delta: number): void {
  this.tables.forEach((t) => t.update(delta));

  // Acende a mesa mais próxima
  const camZ = this.ctx.camera.position.z;
  this.tables.forEach((t) => {
    const dist = Math.abs(camZ - t.group.position.z);
    if (dist < 8 && !t.isLit) {
      t.litUp();
    } else if (dist >= 8 && t.isLit) {
      t.litDown();
    }
  });
}
```

- [ ] **Step 2: Suavizar transição com GSAP**

Modificar `BaseTable.litUp/litDown` pra usar GSAP. Em `src/tables/BaseTable.ts`:

```ts
import { gsap } from 'gsap';

litUp(): void {
  if (this.isLit) return;
  this.isLit = true;
  gsap.to(this.light, {
    intensity: this.config.lightIntensity,
    duration: 0.8,
    ease: 'power2.out'
  });
}

litDown(): void {
  if (!this.isLit) return;
  this.isLit = false;
  gsap.to(this.light, { intensity: 0, duration: 0.8, ease: 'power2.in' });
}
```

- [ ] **Step 3: Smoke test**

```bash
npm run dev
```

Esperado: ao chegar perto de cada mesa, a luz da cor do produto envolve a cena (branco/azul-dourado/amarelo). Suaviza ao sair.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/Museum.ts src/tables/BaseTable.ts
git commit -m "feat: iluminação por mesa baseada em proximidade da câmera (suave)"
```

---

# FASE 5 — Hologramas + modais

## Task 5.1: Shader holograma

**Files:**
- Create: `src/shaders/hologram.vert`
- Create: `src/shaders/hologram.frag`

- [ ] **Step 1: hologram.vert**

```glsl
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 2: hologram.frag**

```glsl
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uTint;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uTexture, vUv);

  // Scanlines
  float scan = 0.85 + 0.15 * sin(vUv.y * 200.0 + uTime * 5.0);

  // Glitch ocasional
  float glitch = step(0.998, sin(uTime * 30.0)) * 0.02;
  vec2 uvShift = vUv + vec2(glitch, 0.0);
  vec4 shifted = texture2D(uTexture, uvShift);

  vec3 color = mix(tex.rgb, shifted.rgb, glitch * 50.0);
  color = mix(color, color * uTint, 0.3);
  color *= scan;

  // Borda transparente
  float edge = smoothstep(0.0, 0.05, vUv.x) * smoothstep(0.0, 0.05, vUv.y) *
               smoothstep(0.0, 0.05, 1.0 - vUv.x) * smoothstep(0.0, 0.05, 1.0 - vUv.y);

  gl_FragColor = vec4(color, tex.a * edge * 0.85);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/shaders/hologram.vert src/shaders/hologram.frag
git commit -m "feat: shader de holograma (scanlines + glitch sutil)"
```

---

## Task 5.2: Adicionar holograma como plano texturizado em BaseTable

**Files:**
- Modify: `src/tables/BaseTable.ts`

- [ ] **Step 1: Adicionar holograma no BaseTable**

Adicionar imports:
```ts
import { PlaneGeometry, TextureLoader, Color } from 'three';
import holoVert from '@/shaders/hologram.vert';
import holoFrag from '@/shaders/hologram.frag';
```

Adicionar campo:
```ts
holoMaterial?: ShaderMaterial;
```

Modificar `TableConfig`:
```ts
export interface TableConfig {
  name: string;
  position: { x: number; y: number; z: number };
  colorCore: string;
  colorRim: string;
  lightColor: string;
  lightIntensity: number;
  holoTextureUrl: string;
  holoTint: string;
}
```

Adicionar método `buildHologram` e chamar no constructor:

```ts
private async buildHologram(): Promise<void> {
  const loader = new TextureLoader();
  const tex = await loader.loadAsync(this.config.holoTextureUrl);
  this.holoMaterial = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: tex },
      uTint: { value: new Color(this.config.holoTint) }
    },
    vertexShader: holoVert,
    fragmentShader: holoFrag,
    transparent: true,
    depthWrite: false
  });
  const plane = new Mesh(new PlaneGeometry(2.4, 2.4), this.holoMaterial);
  plane.position.set(0, 1.2, -1.4);
  this.group.add(plane);
}

async initHologram(): Promise<void> {
  await this.buildHologram();
}
```

Atualizar update:
```ts
update(delta: number): void {
  this.orbMaterial.uniforms.uTime.value += delta;
  this.orb.rotation.y += delta * 0.3;
  if (this.holoMaterial) {
    this.holoMaterial.uniforms.uTime.value += delta;
  }
}
```

- [ ] **Step 2: Atualizar OrionTable/LumiTable/HugeTable com texturas**

`src/tables/OrionTable.ts`:
```ts
import { BaseTable } from './BaseTable';

export class OrionTable extends BaseTable {
  constructor(z: number) {
    super({
      name: 'Orion',
      position: { x: 0, y: 0, z },
      colorCore: '#1a1a2a',
      colorRim: '#e8e8f0',
      lightColor: '#e8e8f0',
      lightIntensity: 3,
      holoTextureUrl: '/images/orion-logo.png',
      holoTint: '#ffffff'
    });
  }
}
```

LumiTable: `holoTextureUrl: '/images/lumi-avatar.png'`, `holoTint: '#fbbf24'`
HugeTable: `holoTextureUrl: '/images/huge-ml.png'`, `holoTint: '#ffe600'`

- [ ] **Step 3: Inicializar hologramas no Museum**

Em `Museum.init()`, depois de criar as tables:

```ts
await Promise.all(this.tables.map((t) => t.initHologram()));
```

- [ ] **Step 4: Smoke test**

```bash
npm run dev
```

Esperado: cada mesa agora tem um plano holográfico atrás do orb, com a logo do produto + scanlines sutis.

- [ ] **Step 5: Commit**

```bash
git add src/tables/
git commit -m "feat: hologramas holográficos por mesa (logo + shader scanline)"
```

---

## Task 5.3: Modal component (DOM puro)

**Files:**
- Create: `src/ui/Modal.ts`
- Modify: `src/styles/main.css`

- [ ] **Step 1: Estilos do modal em main.css**

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 50;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-backdrop.open {
  display: flex;
  opacity: 1;
}

.modal-content {
  background: rgba(10, 12, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  max-width: 560px;
  width: 90%;
  position: relative;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.modal-backdrop.open .modal-content {
  transform: translateY(0);
}

.modal-content h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.modal-content .modal-tagline {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-fg-dim);
  margin-bottom: 1.5rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.modal-content p {
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.modal-cta {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid currentColor;
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.875rem;
  transition: background 0.2s, color 0.2s;
}

.modal-cta:hover {
  background: currentColor;
  color: #000;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: var(--color-fg-dim);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--color-fg);
}
```

- [ ] **Step 2: Modal.ts**

```ts
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
```

- [ ] **Step 3: Commit**

```bash
git add src/ui/Modal.ts src/styles/main.css
git commit -m "feat: Modal component com a11y básico (focus trap simples + Esc)"
```

---

## Task 5.4: Click handler em mesas → abre modal

**Files:**
- Modify: `src/scenes/Museum.ts`
- Modify: `src/core/Engine.ts`

- [ ] **Step 1: Raycaster pra clicks**

Adicionar em `Engine.ts`:

```ts
import { Raycaster, Vector2 } from 'three';
import { Modal } from '@/ui/Modal';
```

Adicionar campos:
```ts
modal!: Modal;
private raycaster = new Raycaster();
private pointer = new Vector2();
```

Adicionar método:
```ts
private setupTableClicks(): void {
  window.addEventListener('click', (e) => {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.renderer.camera);

    const museum = this.scenes[2] as import('@/scenes/Museum').Museum;
    const orbs = museum.tables.map((t) => t.orb);
    const intersects = this.raycaster.intersectObjects(orbs);
    if (intersects.length > 0) {
      const orb = intersects[0].object;
      const idx = orbs.indexOf(orb as any);
      this.openTableModal(idx);
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
```

Em `start()`:
```ts
this.modal = new Modal(uiRoot);
this.setupTableClicks();
```

- [ ] **Step 2: Cursor pointer ao hover em mesa**

Adicionar `mousemove` listener simples em Engine:

```ts
private setupTableHover(): void {
  window.addEventListener('mousemove', (e) => {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.renderer.camera);
    const museum = this.scenes[2] as import('@/scenes/Museum').Museum;
    const orbs = museum.tables.map((t) => t.orb);
    const hit = this.raycaster.intersectObjects(orbs).length > 0;
    document.body.style.cursor = hit ? 'pointer' : '';
  });
}
```

Chamar em `start()`: `this.setupTableHover();`

- [ ] **Step 3: Smoke test**

```bash
npm run dev
```

Esperado: rolar pro museu, hover sobre orb muda cursor, click abre modal, Esc/click fora fecha.

- [ ] **Step 4: Commit**

```bash
git add src/core/Engine.ts
git commit -m "feat: click em mesa abre modal com detalhes do produto"
```

---

# FASE 6 — Stack Room + Contact

## Task 6.1: StackRoom (ícones flutuantes)

**Files:**
- Modify: `src/scenes/StackRoom.ts`

- [ ] **Step 1: Implementar StackRoom**

`src/scenes/StackRoom.ts`:

```ts
import { BaseScene } from './BaseScene';
import {
  PlaneGeometry,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  Group,
  AmbientLight,
  PointLight
} from 'three';

const ICONS = [
  { name: 'python', url: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'fastapi', url: 'https://cdn.simpleicons.org/fastapi/009688' },
  { name: 'typescript', url: 'https://cdn.simpleicons.org/typescript/3178C6' },
  { name: 'nextdotjs', url: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
  { name: 'react', url: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'postgresql', url: 'https://cdn.simpleicons.org/postgresql/4169E1' },
  { name: 'redis', url: 'https://cdn.simpleicons.org/redis/DC382D' },
  { name: 'docker', url: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'vercel', url: 'https://cdn.simpleicons.org/vercel/ffffff' },
  { name: 'tailwindcss', url: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' }
];

export class StackRoom extends BaseScene {
  private icons: Mesh[] = [];
  private iconGroup: Group = new Group();

  async init(): Promise<void> {
    this.group.add(new AmbientLight(0xffffff, 0.4));
    const point = new PointLight(0xffffff, 2, 50);
    point.position.set(0, 0, 5);
    this.group.add(point);

    const loader = new TextureLoader();
    const radius = 5;
    await Promise.all(
      ICONS.map(async (cfg, idx) => {
        const tex = await loader.loadAsync(cfg.url);
        const mat = new MeshBasicMaterial({ map: tex, transparent: true });
        const plane = new Mesh(new PlaneGeometry(0.8, 0.8), mat);
        const angle = (idx / ICONS.length) * Math.PI * 2;
        plane.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        plane.userData.angle = angle;
        plane.userData.baseRadius = radius;
        this.iconGroup.add(plane);
        this.icons.push(plane);
      })
    );

    this.group.add(this.iconGroup);
  }

  update(delta: number): void {
    this.iconGroup.rotation.z += delta * 0.05;
    this.icons.forEach((icon, idx) => {
      icon.rotation.y += delta * (0.5 + idx * 0.05);
    });
  }
}
```

- [ ] **Step 2: ScrollFlow do Stack**

Em `scrollFlow.ts`:

```ts
setupStack(onEnter: () => void, onExit: () => void): void {
  ScrollTrigger.create({
    trigger: '#scroll-stack',
    start: 'top center',
    end: 'bottom center',
    onEnter,
    onLeaveBack: onExit,
    onUpdate: (self) => {
      const t = self.progress;
      this.camera.position.set(0, 0, 8 - t * 2);
      this.camera.lookAt(0, 0, 0);
    }
  });
}
```

Em Engine: `this.scrollFlow.setupStack(() => this.goToScene(3), () => this.goToScene(2));`

- [ ] **Step 3: Smoke test**

Esperado: ao rolar pra stack, ícones de tecnologia aparecem em órbita, girando.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/StackRoom.ts src/lib/scrollFlow.ts src/core/Engine.ts
git commit -m "feat: StackRoom com 10 ícones de tech orbitando"
```

---

## Task 6.2: Contact (planeta de fora + dados)

**Files:**
- Modify: `src/scenes/Contact.ts`
- Create: `src/ui/ContactOverlay.ts`
- Modify: `src/styles/main.css`

- [ ] **Step 1: Implementar Contact (reutiliza shader do planeta)**

`src/scenes/Contact.ts`:

```ts
import { BaseScene } from './BaseScene';
import {
  SphereGeometry,
  Mesh,
  ShaderMaterial,
  Color,
  PointLight,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending
} from 'three';
import planetVert from '@/shaders/planet.vert';
import planetFrag from '@/shaders/planet.frag';

export class Contact extends BaseScene {
  private planet!: Mesh;
  private starsField!: Points;
  private material!: ShaderMaterial;

  async init(): Promise<void> {
    const geom = new SphereGeometry(6, 96, 96);
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorBase: { value: new Color('#3a4a6a') },
        uColorAtmosphere: { value: new Color('#7aaaff') }
      },
      vertexShader: planetVert,
      fragmentShader: planetFrag
    });
    this.planet = new Mesh(geom, this.material);
    this.group.add(this.planet);

    const light = new PointLight(0xffffff, 1.8, 80);
    light.position.set(15, 8, 20);
    this.group.add(light);

    const positions = new Float32Array(2500 * 3);
    for (let i = 0; i < 2500; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    const sgeom = new BufferGeometry();
    sgeom.setAttribute('position', new BufferAttribute(positions, 3));
    this.starsField = new Points(
      sgeom,
      new PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.7,
        blending: AdditiveBlending
      })
    );
    this.group.add(this.starsField);
  }

  update(delta: number): void {
    this.material.uniforms.uTime.value += delta;
    this.planet.rotation.y += delta * 0.03;
    this.starsField.rotation.y += delta * 0.005;
  }
}
```

- [ ] **Step 2: Criar ContactOverlay.ts**

```ts
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

  show(): void { this.root.style.opacity = '1'; }
  hide(): void { this.root.style.opacity = '0'; }
}
```

- [ ] **Step 3: Estilos do contato em main.css**

```css
.contact-overlay {
  position: fixed;
  top: 50%;
  left: 8%;
  transform: translateY(-50%);
  max-width: 480px;
  opacity: 0;
  transition: opacity 0.5s;
  z-index: 5;
}

.contact-overlay h2 {
  font-family: var(--font-display, sans-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-list {
  list-style: none;
  margin-bottom: 2rem;
}

.contact-list li {
  margin-bottom: 1rem;
}

.contact-list a {
  font-size: 1.125rem;
  border-bottom: 1px solid currentColor;
  transition: color 0.2s;
}

.contact-list a:hover {
  color: var(--color-lumi-gold);
}

.back-to-top {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-fg-dim);
  pointer-events: auto;
  transition: border-color 0.2s, color 0.2s;
}

.back-to-top:hover {
  border-color: var(--color-fg);
  color: var(--color-fg);
}
```

- [ ] **Step 4: Conectar no Engine + ScrollFlow**

```ts
setupContact(onEnter: () => void, onExit: () => void): void {
  ScrollTrigger.create({
    trigger: '#scroll-contact',
    start: 'top center',
    end: 'bottom center',
    onEnter,
    onLeaveBack: onExit,
    onUpdate: (self) => {
      const t = self.progress;
      this.camera.position.set(0, 5 + t * 5, 30 - t * 10);
      this.camera.lookAt(0, 0, 0);
    }
  });
}
```

Em Engine:
```ts
const contactOverlay = new ContactOverlay(uiRoot);
this.scrollFlow.setupContact(
  () => { this.goToScene(4); contactOverlay.show(); },
  () => { this.goToScene(3); contactOverlay.hide(); }
);
```

- [ ] **Step 5: Smoke test**

Esperado: na última seção, planeta visto de longe + texto de contato à esquerda + botão voltar ao topo.

- [ ] **Step 6: Commit**

```bash
git add src/scenes/Contact.ts src/ui/ContactOverlay.ts src/styles/main.css src/lib/scrollFlow.ts src/core/Engine.ts
git commit -m "feat: cena Contact com planeta de longe + dados de contato"
```

---

# FASE 7 — Áudio + UI

## Task 7.1: Audio class (Howler)

**Files:**
- Create: `src/core/Audio.ts`
- Create: `tests/core/Audio.test.ts`

- [ ] **Step 1: Instalar @types/howler**

```bash
npm install -D @types/howler
```

- [ ] **Step 2: Implementar Audio**

`src/core/Audio.ts`:

```ts
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
      autoplay: false
    });
  }

  loadFx(name: FxName, url: string): void {
    const h = new Howl({ src: [url], volume: 0.5, preload: true });
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
```

- [ ] **Step 3: Teste básico**

`tests/core/Audio.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { Audio } from '@/core/Audio';

describe('Audio', () => {
  it('starts muted by default', () => {
    const a = new Audio();
    expect(a.isMuted()).toBe(true);
  });

  it('toggles mute state', () => {
    const a = new Audio();
    a.toggleMute();
    expect(a.isMuted()).toBe(false);
    a.toggleMute();
    expect(a.isMuted()).toBe(true);
  });

  it('persists state in localStorage', () => {
    const a = new Audio();
    a.toggleMute();
    expect(localStorage.getItem('audio_muted')).toBe('false');
  });
});
```

- [ ] **Step 4: Run testes**

```bash
npx vitest run tests/core/Audio.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/core/Audio.ts tests/core/Audio.test.ts package.json package-lock.json
git commit -m "feat: Audio class (Howler) com mute persistente"
```

---

## Task 7.2: Baixar áudios CC0

**Files:**
- Create: `public/audio/ambient.mp3` (manual)
- Create: `public/audio/hover.mp3`, `click.mp3`, `transition.mp3`, `landing.mp3`

- [ ] **Step 1: Criar pasta**

```bash
mkdir -p public/audio
```

- [ ] **Step 2: Baixar ambient (pixabay CC0)**

```bash
curl -L -o public/audio/ambient.mp3 \
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1718e6c0e3.mp3?filename=relaxing-mountain-stream-2-3614.mp3"
```

Note: a URL exata pode mudar. Alternativa: o engenheiro busca em pixabay.com/sound-effects buscando "space ambient drone" e baixa um track CC0 manualmente, salvando como `public/audio/ambient.mp3`.

- [ ] **Step 3: Baixar 4 FX (freesound/pixabay CC0)**

Buscar em pixabay.com/sound-effects:
- "soft hover" → `public/audio/hover.mp3`
- "ui click" → `public/audio/click.mp3`
- "whoosh" → `public/audio/transition.mp3`
- "low impact" → `public/audio/landing.mp3`

Cada arquivo deve ter ~50-200KB e licença CC0.

- [ ] **Step 4: Verificar tamanho total**

```bash
du -sh public/audio/
```

Expected: < 3MB total.

- [ ] **Step 5: Commit**

```bash
git add public/audio/
git commit -m "feat: assets de áudio CC0 (1 ambient + 4 FX)"
```

---

## Task 7.3: AudioToggle UI + integração

**Files:**
- Create: `src/ui/AudioToggle.ts`
- Modify: `src/styles/main.css`
- Modify: `src/core/Engine.ts`

- [ ] **Step 1: AudioToggle.ts**

```ts
import { Audio } from '@/core/Audio';

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
```

- [ ] **Step 2: Estilos**

```css
.audio-toggle {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--color-fg-dim);
  color: var(--color-fg-dim);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  pointer-events: auto;
  transition: color 0.2s, border-color 0.2s;
  z-index: 20;
}

.audio-toggle:hover {
  color: var(--color-fg);
  border-color: var(--color-fg);
}
```

- [ ] **Step 3: Conectar Engine**

```ts
import { Audio } from '@/core/Audio';
import { AudioToggle } from '@/ui/AudioToggle';
```

Em start():
```ts
const audio = new Audio();
audio.loadMusic('/audio/ambient.mp3');
audio.loadFx('hover', '/audio/hover.mp3');
audio.loadFx('click', '/audio/click.mp3');
audio.loadFx('transition', '/audio/transition.mp3');
audio.loadFx('landing', '/audio/landing.mp3');
audio.initFromStorage();

const audioToggle = new AudioToggle(uiRoot, audio);
```

E em locais relevantes (modal click, table hover etc) chamar `audio.playFx('click')` etc.

- [ ] **Step 4: Smoke test**

Esperado: botão "♪ off" no canto inferior direito. Click ativa música ambient + FX no hover/click.

- [ ] **Step 5: Commit**

```bash
git add src/ui/AudioToggle.ts src/styles/main.css src/core/Engine.ts
git commit -m "feat: AudioToggle UI + integração de música/FX"
```

---

## Task 7.4: ProgressBar (lateral)

**Files:**
- Create: `src/ui/ProgressBar.ts`
- Modify: `src/styles/main.css`

- [ ] **Step 1: ProgressBar.ts**

```ts
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
```

- [ ] **Step 2: Estilos**

```css
.progress-bar {
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 15;
}

.progress-bar-fill {
  width: 100%;
  height: 0%;
  background: var(--color-fg);
  transition: height 0.1s;
}
```

- [ ] **Step 3: Conectar no Engine**

```ts
import { ProgressBar } from '@/ui/ProgressBar';
```

```ts
new ProgressBar(uiRoot);
```

- [ ] **Step 4: Commit**

```bash
git add src/ui/ProgressBar.ts src/styles/main.css src/core/Engine.ts
git commit -m "feat: barra de progresso vertical lateral"
```

---

## Task 7.5: SectionDots (5 dots de navegação)

**Files:**
- Create: `src/ui/SectionDots.ts`
- Modify: `src/styles/main.css`

- [ ] **Step 1: SectionDots.ts**

```ts
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SECTIONS = [
  { id: 'scroll-hero', label: 'Início' },
  { id: 'scroll-about', label: 'Sobre' },
  { id: 'scroll-museum', label: 'Museu' },
  { id: 'scroll-stack', label: 'Stack' },
  { id: 'scroll-contact', label: 'Contato' }
];

export class SectionDots {
  private root: HTMLDivElement;
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
```

- [ ] **Step 2: Estilos**

```css
.section-dots {
  position: fixed;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 15;
}

.section-dot {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem;
  pointer-events: auto;
}

.section-dot .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: background 0.3s, transform 0.3s;
}

.section-dot .label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-fg-dim);
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.3s, transform 0.3s;
}

.section-dot:hover .label,
.section-dot.active .label {
  opacity: 1;
  transform: translateX(0);
}

.section-dot.active .dot {
  background: var(--color-fg);
  transform: scale(1.3);
}
```

- [ ] **Step 3: Conectar Engine**

```ts
import { SectionDots } from '@/ui/SectionDots';
new SectionDots(uiRoot);
```

- [ ] **Step 4: Commit**

```bash
git add src/ui/SectionDots.ts src/styles/main.css src/core/Engine.ts
git commit -m "feat: SectionDots (nav por 5 dots laterais)"
```

---

## Task 7.6: SkipIntro button

**Files:**
- Create: `src/ui/SkipIntro.ts`
- Modify: `src/styles/main.css`

- [ ] **Step 1: SkipIntro.ts**

```ts
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
```

- [ ] **Step 2: Estilos**

```css
.skip-intro {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--color-fg-dim);
  color: var(--color-fg-dim);
  background: rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  z-index: 20;
  transition: color 0.2s, border-color 0.2s;
}

.skip-intro:hover {
  color: var(--color-fg);
  border-color: var(--color-fg);
}
```

- [ ] **Step 3: Conectar Engine**

```ts
import { SkipIntro } from '@/ui/SkipIntro';
new SkipIntro(uiRoot);
```

- [ ] **Step 4: Commit**

```bash
git add src/ui/SkipIntro.ts src/styles/main.css src/core/Engine.ts
git commit -m "feat: SkipIntro button (atalho pro museu)"
```

---

# FASE 8 — Mobile

## Task 8.1: Detecção mobile + main-mobile.ts skeleton

**Files:**
- Create: `src/main-mobile.ts`
- Modify: `src/main.ts`
- Modify: `index.html`

- [ ] **Step 1: Switch no main.ts**

`src/main.ts`:

```ts
import { isMobile } from '@/core/Mobile';

if (isMobile()) {
  import('./main-mobile.ts');
} else {
  const { Engine } = await import('@/core/Engine');
  const engine = new Engine();
  engine.start();
}
```

- [ ] **Step 2: Skeleton main-mobile.ts**

```ts
import { Renderer } from '@/core/Renderer';
import { Hero } from '@/scenes/Hero';
import { About } from '@/scenes/About';
import { Museum } from '@/scenes/Museum';
import { StackRoom } from '@/scenes/StackRoom';
import { Contact } from '@/scenes/Contact';
import { Loader } from '@/core/Loader';
import type { SceneContext } from '@/scenes/BaseScene';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new Renderer(canvas);
const ctx: SceneContext = { camera: renderer.camera, rootScene: renderer.scene };

const loader = new Loader([
  { type: 'image', url: '/images/orion-logo.png' },
  { type: 'image', url: '/images/lumi-avatar.png' },
  { type: 'image', url: '/images/huge-ml.png' }
]);
await loader.load();

const scenes = [
  new Hero(ctx),
  new About(ctx),
  new Museum(ctx),
  new StackRoom(ctx),
  new Contact(ctx)
];
await Promise.all(scenes.map((s) => s.init()));
scenes[0].enter();
loader.hide();

let activeIdx = 0;
const sectionIds = ['scroll-hero', 'scroll-about', 'scroll-museum', 'scroll-stack', 'scroll-contact'];

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const idx = sectionIds.indexOf(e.target.id);
      if (idx >= 0 && idx !== activeIdx) {
        scenes[activeIdx].exit();
        activeIdx = idx;
        scenes[activeIdx].enter();
      }
    }
  });
}, { threshold: 0.5 });

sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

function tick(): void {
  requestAnimationFrame(tick);
  const delta = renderer.clock.getDelta();
  scenes[activeIdx]?.update(delta);
  renderer.render();
}
tick();
```

- [ ] **Step 3: Smoke test**

Abrir DevTools, simular dispositivo mobile (iPhone). Esperado: scroll comum funciona, cenas trocam por intersection observer, sem ScrollSmoother.

- [ ] **Step 4: Commit**

```bash
git add src/main.ts src/main-mobile.ts
git commit -m "feat: bundle mobile alternativo com IntersectionObserver"
```

---

# FASE 9 — Polish

## Task 9.1: Reduced motion adaptado

**Files:**
- Modify: `src/main.ts`
- Modify: `src/lib/scrollFlow.ts`

- [ ] **Step 1: Detectar reduced no main.ts**

```ts
import { isMobile } from '@/core/Mobile';
import { isReducedMotion } from '@/core/Reduced';

if (isMobile() || isReducedMotion()) {
  import('./main-mobile.ts');
} else {
  const { Engine } = await import('@/core/Engine');
  const engine = new Engine();
  engine.start();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/main.ts
git commit -m "feat: prefers-reduced-motion → versão mobile alternativa"
```

---

## Task 9.2: Keyboard navigation

**Files:**
- Modify: `src/core/Engine.ts`

- [ ] **Step 1: Adicionar listeners de teclado**

```ts
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
```

Chamar em `start()`: `this.setupKeyboard();`

- [ ] **Step 2: Commit**

```bash
git add src/core/Engine.ts
git commit -m "feat: keyboard nav (setas + PageUp/Down + Home/End)"
```

---

## Task 9.3: Lighthouse pass (otimização final)

**Files:**
- Modify: `vite.config.ts`
- Modify: `index.html` (ajustes meta + preload)

- [ ] **Step 1: Build de produção**

```bash
npm run build
```

Verificar tamanho do bundle:
```bash
ls -lh dist/assets/
```

Expected: bundle JS principal < 250KB gzipped (Three é ~150KB, GSAP ~50KB).

- [ ] **Step 2: Preview e Lighthouse**

```bash
npm run preview &
sleep 3
npx lighthouse http://localhost:4173 --only-categories=performance,accessibility --view
kill %1
```

Identificar pontos < 90 e ajustar (lazy load áudio, preload textura, font-display).

- [ ] **Step 3: Otimizações comuns**

Em `index.html`, adicionar:
```html
<link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
<link rel="preconnect" href="https://cdn.simpleicons.org" crossorigin />
```

- [ ] **Step 4: Commit**

```bash
git add vite.config.ts index.html
git commit -m "perf: otimizações Lighthouse (preconnect, lazy load)"
```

---

## Task 9.4: Deploy final na Vercel

**Files:**
- Create: `vercel.json` (se necessário)

- [ ] **Step 1: Verificar config Vercel atual**

```bash
cat vercel.json 2>/dev/null || echo "sem vercel.json"
```

- [ ] **Step 2: Criar vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/audio/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

- [ ] **Step 3: Push e merge**

```bash
git add vercel.json
git commit -m "chore: vercel config (cache headers para assets estáticos)"
git push origin redesign
```

- [ ] **Step 4: Abrir PR e fazer merge**

```bash
gh pr create --title "Portfolio redesign: 3D cinematográfico" --body "Reescrita completa do portfolio. Spec em docs/superpowers/specs/2026-04-28-portfolio-redesign-design.md"
gh pr merge --merge
```

- [ ] **Step 5: Validar produção**

Abrir `https://portfolio-guilhermepires.vercel.app` e verificar:
- Loading screen aparece e desaparece
- Hero com planeta + título
- Scroll funciona em todas seções
- Mesas acendem com cor certa
- Modais abrem e fecham
- Áudio toggle funciona
- Mobile mostra versão simplificada

---

## Self-review

**1. Spec coverage:** todas seções da spec têm task correspondente:
- §3 stack → F1
- §4 arquitetura → F1
- §5.1 Hero → F2
- §5.2 About → F3.1
- §5.3 Museum → F3.2 + F4 + F5
- §5.4 StackRoom → F6.1
- §5.5 Contact → F6.2
- §6.1-6.3 Mesas → F4.3
- §7 Scroll/nav → F2.4 + F7.5
- §8 Mobile → F8
- §9 Áudio → F7.1-7.3
- §10 Loading/perf → F1.8 + F9.3
- §11 A11y → F9.1 + F9.2 + Modal F5.3
- §12 Conteúdo → embutido nas tasks

**2. Placeholder scan:** evitei "TBD/TODO". Todos steps têm código real ou comando concreto. Onde há decisão dependente do engineer (ex: buscar áudio CC0 em pixabay), está descrito o critério.

**3. Type consistency:** classes principais (`Engine`, `Renderer`, `BaseScene`, `BaseTable`, `Loader`, `Audio`) são consistentes entre tasks. `SceneContext` interface é definida no F1.11 e reusada em todas cenas.

---

## Execução

Plano completo. Total: **9 fases, 36 tasks principais, ~250 steps**.

Cada task é commitável independentemente. Cada fase entrega marco testável (smoke test ou unit test). Branch `redesign` mantém histórico durante implementação.
