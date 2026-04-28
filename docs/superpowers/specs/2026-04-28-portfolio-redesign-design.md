# Portfolio Redesign — Design Spec

**Data:** 2026-04-28
**Autor do design:** Guilherme Pires + Claude (brainstorming)
**Repo de destino:** `guiwsch/portfolio`

---

## 1. Objetivo

Reescrever do zero o portfolio pessoal de Guilherme Pires como um **showcase 3D cinematográfico** que apresente a pessoa e três produtos SaaS próprios (Orion Bots, Lumi Assessora, Huge ML). Resultado deve ter qualidade de portfolio premiado (referências: bruno-simon.com, lusion.co, vertex3d.asia), entregue por um único dev solo, com **custo zero em assets/licenças**.

O portfolio atual (HTML/CSS vanilla mostrando projetos antigos: PetDev, Paixão em Tela, Bendito Yoga) será **descartado integralmente**. Esses projetos não existem mais e não serão referenciados.

---

## 2. Conceito narrativo

Aterrissagem cinemática em primeira pessoa: visitante "voa" em direção a um planeta, pousa, entra num museu interestelar, visita três mesas (uma por produto SaaS), passa por uma sala de tecnologias e sai vendo o planeta de longe. Cinco seções unificadas por um único movimento contínuo de câmera 3D guiado pelo scroll.

A metáfora "mesa de museu por produto" reforça que cada SaaS é uma identidade própria — quando o visitante chega numa mesa, a iluminação da cena assume a cor da marca daquele produto. O usuário **sente** a mudança de contexto.

---

## 3. Stack técnica

| Camada | Escolha | Motivo |
|---|---|---|
| Build/dev | **Vite** | Build rápido, HMR instantâneo, bundle minimalista |
| Linguagem | **TypeScript** | Tipagem em código de animação 3D evita classes inteiras de bug |
| 3D | **Three.js** (latest) | Padrão de WebGL, comunidade enorme, custo zero |
| Animação | **GSAP** + **ScrollTrigger** + **ScrollSmoother** + **SplitText** | 100% gratuito desde 2024 (Webflow). API consistente, perf top |
| Áudio | **Howler.js** | Cross-browser, simples, leve |
| Postprocessing | `three/examples/jsm/postprocessing` (Bloom, FilmPass) | Já vem com Three, sem dependência extra |
| Hospedagem | **Vercel** (atual) | Já configurado, gzip+brotli automáticos |

Sem React, sem Next, sem Astro. Vanilla TypeScript com classes.

---

## 4. Arquitetura

```
portfolio/
├── public/
│   ├── audio/                  4 FX + 1 música ambient (CC0)
│   └── images/
│       ├── orion-logo.png      (já temos)
│       ├── lumi-avatar.png     (já temos)
│       └── huge-ml.png         (já temos)
├── src/
│   ├── main.ts                 entry point, inicializa Engine
│   ├── core/
│   │   ├── Engine.ts           orquestra Renderer, Scenes, Audio, UI
│   │   ├── Renderer.ts         setup Three (scene, camera, renderer, postprocessing)
│   │   ├── Loader.ts           preload + tela de loading
│   │   ├── Audio.ts            gerencia música ambiente + FX
│   │   ├── Reduced.ts          detecta prefers-reduced-motion
│   │   └── Mobile.ts           detecta mobile, switcha pra versão simplificada
│   ├── scenes/
│   │   ├── BaseScene.ts        classe base: init/enter/update/exit
│   │   ├── Hero.ts             planeta + título
│   │   ├── About.ts            avatar + bio
│   │   ├── Museum.ts           hall com 3 mesas
│   │   ├── StackRoom.ts        ícones flutuantes
│   │   └── Contact.ts          planeta de fora + dados de contato
│   ├── tables/
│   │   ├── BaseTable.ts        classe base de mesa (orb + holograma + texto + modal)
│   │   ├── OrionTable.ts       luz branca/cinza, mockup WhatsApp
│   │   ├── LumiTable.ts        luz azul royal + dourada, mockup chat financeiro
│   │   └── HugeTable.ts        luz amarela, mockup cards Mercado Livre
│   ├── shaders/
│   │   ├── planet.vert/frag    planeta procedural (noise + atmosphere)
│   │   ├── orb.vert/frag       orb pulsante com cor do produto
│   │   └── hologram.vert/frag  efeito de "scanlines" + glitch nos hologramas
│   ├── ui/
│   │   ├── ProgressBar.ts      barra de scroll na lateral
│   │   ├── SectionDots.ts      5 dots com label da seção (clica e navega)
│   │   ├── Modal.ts            modal ao clicar numa mesa
│   │   ├── AudioToggle.ts      botão mute/unmute (default OFF)
│   │   └── SkipIntro.ts        atalho pra ir direto pro museu
│   ├── lib/
│   │   ├── scrollFlow.ts       timeline mestre GSAP coordenando todas cenas
│   │   ├── lerp.ts             utilitário de interpolação
│   │   └── easing.ts           curvas de easing custom
│   └── styles/
│       ├── reset.css
│       └── main.css            só pra UI overlay (HTML), não pra cena 3D
├── index.html                  estrutura HTML mínima + meta tags + OG
├── vite.config.ts
└── package.json
```

**Princípios:**
- Cada cena é uma classe que estende `BaseScene`, com ciclo de vida claro (`init/enter/update/exit`)
- Cada mesa estende `BaseTable` — adicionar uma 4ª mesa no futuro = nova classe + 1 linha no `Museum.ts`
- Shaders separados em arquivos `.glsl` carregados via Vite plugin (`vite-plugin-glsl`)
- Zero dependência de framework UI — overlay HTML é manipulado direto via DOM API

---

## 5. As cinco cenas

### 5.1. Hero / Aterrissagem

- **Inicial:** tela preta, estrela única pulsando ao centro, título tipográfico "GUILHERME PIRES" aparecendo letra por letra (SplitText)
- **Subtítulo:** "Software Engineer · Founder of SaaS products"
- **Durante scroll:** estrela cresce, revela ser um planeta procedural (shader GLSL — atmosphere fresnel azul-acinzentada, noise para superfície, anel sutil ao redor). Câmera começa a 50 unidades de distância, vai pra 8 unidades
- **Final:** câmera atravessa atmosfera, fade out preto, transição pra Cena 2
- **Loading hint visual:** estrela inicial é a barra de progresso (cresce conforme assets carregam)

### 5.2. About / Sobre

- **Setup:** câmera pousada num ambiente escuro com luz fria-azul lateral
- **Esquerda:** silhueta low-poly abstrata (sem rosto, geometria angular tipo polígono baixo) — representa "o construtor"
- **Direita:** texto biográfico aparecendo linha por linha conforme scroll
- **Bio (proposta):**

> Engenheiro de software baseado em Florianópolis, fundador e construtor de produtos SaaS. Trabalho do código à arquitetura, do design ao deploy. Foco em construir produtos que resolvem problemas reais: atendimento via WhatsApp com IA, organização financeira pessoal, automação de e-commerce. Backend forte em Python/FastAPI, frontend pixel-perfect em Next.js. Construo rápido, valido com usuário real, itero.

- **Detalhe ambiente:** partículas de "poeira lunar" flutuando lentamente
- **Animação avatar:** rotação suave constante (~0.1 rad/s)

### 5.3. Museum / Museu (peça central)

- **Setup:** câmera entra num corredor escuro, 3 mesas alinhadas no eixo Z (separadas ~12 unidades cada)
- **Movimento:** scroll move câmera ao longo do corredor; ao chegar perto de cada mesa, a câmera **trava** brevemente, faz uma rotação parcial ao redor do orb (~30°), depois libera quando o usuário continua scrollando
- **Iluminação:** ao chegar em cada mesa, **luz pontual da cor do produto** ilumina toda a cena — efeito GSAP fade-in da cor, fade-out ao sair
- **Chão:** plano com leve reflexão (MeshStandardMaterial com metalness alta) — orb e holograma se refletem
- **Tetos/paredes:** geometria simples, low-poly, escura, com luzes pontuais distantes que sugerem corredor longo
- Ver detalhes de cada mesa em §6

### 5.4. Stack Room / Sala de tecnologias

- **Setup:** sala mais aberta após o museu, sem corredor — espaço amplo
- **Conteúdo:** ~10 ícones de tecnologia flutuando em órbitas concêntricas (Python, FastAPI, TypeScript, Next.js, React, PostgreSQL, Redis, Docker, Vercel, Tailwind)
- **Implementação:** planos texturizados com SVGs do `simple-icons.org` (CC0)
- **Animação:** órbitas lentas + rotação individual de cada ícone + escala-up no hover
- **Texto:** "Caixa de ferramentas" como título, "stack que uso pra construir" como subtítulo

### 5.5. Contact / Contato

- **Setup:** câmera sobe verticalmente, planeta inteiro reaparece centralizado, agora visto "de fora"
- **Conteúdo:** "Vamos conversar?" + lista de canais:
  - E-mail (link mailto)
  - LinkedIn (link)
  - GitHub (link `github.com/guiwsch`)
  - WhatsApp (link wa.me com número — só se Guilherme aprovar expor)
- **Animação:** estrelas se movem lentamente em paralax, planeta gira devagar
- **Detalhe:** botão "Voltar ao início" no canto inferior — clica, GSAP scrolla pro topo com easing dramático e câmera "desce de volta"

---

## 6. As três mesas

Cada mesa segue o template:
- **Pedestal** geométrico simples (cilindro low-poly)
- **Orb central** flutuando ~1.5 unidades acima do pedestal, rotação constante, shader pulsante
- **Holograma** flutuando atrás do orb (~3 unidades atrás), efeito de scanlines + glitch sutil
- **Texto na frente** do pedestal (HTML overlay posicionado via projeção 3D→2D)
- **Botão "Visitar →"** abre modal com detalhes + link externo

### 6.1. Orion Table

- **Cor de iluminação:** branco frio (~`#e8e8f0`) com sombras profundas
- **Orb:** preto matte com partículas brancas pequenas orbitando (estilo anel saturno do logo)
- **Textura do orb:** `orion-bots.png` aplicada como decal frontal
- **Holograma:**
  - Logo Orion central
  - Bolhas de chat WhatsApp aparecendo em loop com mensagens fictícias plausíveis ("Olá! Sou seu atendente automático", "Como posso ajudar?", "✓ Mensagem entregue")
  - Indicador verde "online" pulsando
- **Texto:** "Orion Bots — Plataforma multi-tenant de bots WhatsApp com IA"
- **Modal:** descrição mais longa + link `https://orionbots.com.br`

### 6.2. Lumi Table

- **Cor de iluminação:** azul royal profundo (~`#1e3a8a`) com acentos dourados (`#fbbf24`)
- **Orb:** azul escuro com filamentos dourados internos pulsando (shader noise + cor)
- **Textura do orb:** `lumi-avatar.png` como decal frontal (rosto da assessora)
- **Holograma:**
  - Avatar Lumi central
  - Bolhas de chat financeiro animadas ("R$ 45 no mercado anotado ✓", "Você atingiu 80% do orçamento de alimentação", "Meta de economia: R$ 1.200 / R$ 2.000")
  - Barrinha de progresso de orçamento animando suavemente
- **Texto:** "Lumi Assessora — Assistente financeira pessoal com IA"
- **Modal:** descrição + link `https://lumiacessora.com.br`

### 6.3. Huge ML Table

- **Cor de iluminação:** amarelo intenso (~`#ffe600`) com sombras pretas marcadas
- **Orb:** amarelo intenso com símbolos de package/anúncio orbitando (formas geométricas low-poly)
- **Textura do orb:** `huge-ml.png` como decal frontal
- **Holograma:**
  - Logo "ML" amarela central
  - Cards de "anúncio" girando ao redor com texto fictício plausível ("Tênis Nike R$ 299,90", "+12 vendas hoje", "Pergunta respondida automaticamente")
  - Métrica de vendas subindo animada (counter de 0 a um número fictício)
- **Texto:** "Huge ML — SaaS para integração com Mercado Livre"
- **Modal:** descrição + link `https://hugeml.com.br`

---

## 7. Fluxo de scroll e navegação

- **Driver principal:** GSAP ScrollSmoother com inércia suave + ScrollTrigger pra travar/destravar trechos
- **Câmera:** posição e rotação interpoladas de keyframes definidos por seção; cada seção tem `enterTime`, `peakTime`, `exitTime` no eixo de scroll
- **Travas nas mesas:** ScrollTrigger.pin() ativa quando câmera está centralizada na mesa, libera ao continuar scrollando (offset configurado)
- **Indicador visual:** barra de progresso vertical à direita + 5 dots à esquerda (com label da seção, clica e navega)
- **Atalhos de teclado:** setas ↑/↓ avançam/voltam seções, Enter abre modal de mesa em foco, Esc fecha modal
- **Reduced motion:** detecta `prefers-reduced-motion: reduce` → desativa ScrollSmoother, usa scroll comum, animações instantâneas (snap entre seções)

---

## 8. Versão mobile

Detecção: largura de viewport < 768px **ou** touch-only sem mouse. Carrega bundle alternativo (`main-mobile.ts`).

**Mantido:** estética geral, planeta no hero, museu com 3 mesas, orbs com cores por marca, modais.

**Removido/simplificado:**
- Sem ScrollSmoother (scroll nativo direto)
- Sem postprocessing (sem Bloom, sem FilmPass)
- Geometrias 25-50% mais simples (menos polígonos)
- Sem partículas de "poeira lunar"
- Câmera não rotaciona ao redor das mesas — chega de frente, sai de frente
- Hologramas mais simples (menos elementos animados)
- Áudio ambiente desativado por padrão (só FX)

**Target:** 60fps em iPhone 12+ e Android mid-tier.

---

## 9. Áudio

- **Música ambiente:** track CC0 ambient/drone espacial (~3min loop) do pixabay.com (procurar tag "space ambient")
- **FX (4):** todos CC0 do freesound.org / pixabay
  - `hover.mp3` — som suave ao hover em mesas/dots
  - `click.mp3` — clique em UI
  - `transition.mp3` — whoosh em mudança de seção
  - `landing.mp3` — impacto baixo no pouso (Cena 1 → 2)
- **UI:** ícone fixo no canto inferior direito (default OFF, persiste em localStorage)
- **Volume:** -20dB padrão (sutil)

---

## 10. Loading e performance

### Loading screen
- Tela preta full-screen, centralizado:
  - Texto "INICIANDO COORDENADAS..." typewriter
  - Barra de progresso real (0-100% baseada em assets carregados)
  - Estrela única pulsando
- Esconde quando `Loader` reporta 100% + canvas 3D pronto
- Transição: estrela do loading vira a estrela do hero (continuidade visual)

### Preload
- Fontes: `font-display: block` durante loading, swap ao final
- Texturas (logos): preload via `<link rel="preload" as="image">`
- Áudio: lazy (carrega ao primeiro toggle on)
- Shaders: compilados sob demanda (Three.js gerencia)

### Targets de performance
- Lighthouse Performance ≥ 90 em desktop, ≥ 80 em mobile
- First Contentful Paint < 2s
- Largest Contentful Paint < 3s
- Total bundle JS gzipped < 250KB (Three.js + GSAP juntos cabem)
- Total assets < 800KB

### Otimizações
- Tree-shaking agressivo (Vite default)
- Compressão gzip + brotli (Vercel automático)
- Lazy load: cada mesa só carrega seu mockup quando câmera está dentro de 1 mesa de distância
- `<canvas>` único compartilhado por todas as cenas (sem re-criar context)

---

## 11. Acessibilidade

- `prefers-reduced-motion: reduce` → versão sem cinematografia (scroll comum, sem animações de câmera)
- Botão **"Pular intro"** visível desde o início (canto superior direito) — pula direto pra Cena 3 (museu)
- Alt text em todas imagens (HTML overlay)
- Aria-labels nos botões de UI
- Keyboard nav: Tab/Enter/Esc + setas
- Contraste mínimo AA nos textos (WCAG 2.1)
- Modais: focus trap quando aberto, fecha com Esc, restaura foco anterior ao fechar

---

## 12. Conteúdo escrito

### Hero
- **Título:** "GUILHERME PIRES"
- **Subtítulo:** "Software Engineer · Founder of SaaS products"

### About
- **Título:** "Sobre"
- **Bio:** (texto na §5.2)

### Museum
- **Título da seção:** "Museu de Produtos"
- Textos de cada mesa: §6.1, §6.2, §6.3

### Stack
- **Título:** "Caixa de Ferramentas"
- **Subtítulo:** "Stack que uso pra construir"

### Contact
- **Título:** "Vamos conversar?"
- **Lista:** e-mail, LinkedIn, GitHub, WhatsApp (a confirmar exposição do número)

---

## 13. Assets disponíveis (já temos)

- `~/Downloads/github-logos/orion-bots.png` — logo Orion oficial
- `~/Downloads/github-logos/lumi-assessora.png` — avatar da Lumi
- `~/Downloads/github-logos/huge-ml.png` — placeholder ML amarelo

Tudo o mais (texturas de planeta, partículas, ícones de tech) é gerado via shader/canvas/SVG livre — zero compras.

---

## 14. Limitações conhecidas

1. **Sem screencast dos produtos:** os hologramas usam mockups estilizados em vez de vídeos reais das UIs. Decisão consciente — mockup é mais leve, mais coerente visualmente, e o usuário não tem disponibilidade pra gravar. Risco: visitante não vê o produto "rodando de verdade". Mitigação: link no modal pro site real do produto.

2. **Sem foto/avatar real:** Cena 2 usa silhueta abstrata em vez de foto. Decisão consciente — mais coerente com a estética sci-fi. Risco: menos pessoal. Mitigação: foco na bio textual.

3. **Logo do Huge ML é placeholder:** o asset atual (`huge-ml.png`) é um placeholder genérico amarelo "ML". Quando Guilherme tiver uma logo real, basta trocar o arquivo.

4. **Mobile é versão alternativa, não responsiva pura:** mantém conceito mas com complexidade reduzida. Visitantes mobile veem uma "edição lite", não a experiência completa. Decisão consciente — Three.js high-end em mobile mid-tier degrada a percepção do site.

5. **WhatsApp do contato:** depende do Guilherme aprovar expor o número publicamente. Default na implementação: **não exposto** (só e-mail/LinkedIn/GitHub). Pode ser ativado em F6 se Guilherme confirmar.

---

## 15. Fases de entrega

Cada fase entrega um marco testável e deployável (não é "tudo ou nada"). Sem prazos rígidos.

| Fase | Escopo | Critério de aceite |
|---|---|---|
| **F1 — Setup** | Vite+TS+Three+GSAP setup, estrutura de pastas, loading screen, navegação básica entre 5 placeholders | Site abre, loading aparece, scroll move por 5 seções coloridas |
| **F2 — Hero** | Cena 1 completa: planeta procedural com shader, título animado, transição pra Cena 2 | Planeta aparece, título digita, câmera voa em direção |
| **F3 — About + Museum base** | Cena 2 completa, Cena 3 com corredor vazio (sem mesas ainda) | Avatar aparece, bio anima linha a linha, câmera entra no corredor |
| **F4 — Mesas (orbs + iluminação)** | 3 mesas com pedestais, orbs pulsantes nas cores certas, iluminação por mesa | 3 mesas no corredor, cada uma com orb da cor certa, luz muda ao chegar |
| **F5 — Hologramas + modais** | Mockups holográficos (chat, cards, métricas) + modais ao clicar | Cada mesa mostra mockup animado, click abre modal com link |
| **F6 — Stack + Contact** | Cenas 4 e 5 completas | Sala de stack com ícones flutuantes, contato com planeta de fora + dados |
| **F7 — Áudio + UI overlay** | Howler integrado, música ambiente, 4 FX, ícone toggle, barra progresso, dots | Mute funciona, hover/click têm som, UI overlay completo |
| **F8 — Mobile** | Bundle alternativo `main-mobile.ts` com versão simplificada | Em telas <768px ou touch, carrega versão lite funcional |
| **F9 — Polish** | Acessibilidade (reduced-motion, keyboard, aria, focus trap), Lighthouse 90+, deploy final | Lighthouse 90+ em desktop e 80+ em mobile, prefers-reduced-motion respeitado, deploy estável |

---

## 16. Decisões registradas (resumo das escolhas tomadas no brainstorm)

- **Abordagem 3D:** opção C — híbrido cinematic (Three.js + low-poly + shaders custom)
- **Escopo de conteúdo:** opção B — hero + sobre + 3 produtos + stack + contato (sem projetos antigos)
- **Conceito narrativo:** opção A — aterrissagem cinemática
- **Stack/framework:** opção A — Vite + Vanilla TypeScript
- **Paleta:** opção C — base neutra + identidade por produto (cor da iluminação muda por mesa)
- **Hologramas:** opção C — orb pulsante + holograma flutuante (adaptado pra mockup estilizado em vez de vídeo)
- **Idioma:** PT-BR único
- **Áudio default:** OFF
- **Mobile:** versão alternativa simplificada (não responsivo desktop)
