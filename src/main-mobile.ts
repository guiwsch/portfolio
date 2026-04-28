import { Renderer } from '@/core/Renderer';
import { Hero } from '@/scenes/Hero';
import { About } from '@/scenes/About';
import { Museum } from '@/scenes/Museum';
import { StackRoom } from '@/scenes/StackRoom';
import { Contact } from '@/scenes/Contact';
import { Loader } from '@/core/Loader';
import { ContactOverlay } from '@/ui/ContactOverlay';
import { BioOverlay } from '@/ui/BioOverlay';
import { HeroTitle } from '@/ui/HeroTitle';
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

const uiRoot = document.getElementById('ui-root');
if (uiRoot) {
  new HeroTitle(uiRoot).animateIn();
  new BioOverlay(uiRoot);
  new ContactOverlay(uiRoot);
}

setTimeout(() => loader.hide(), 300);

let activeIdx = 0;
const sectionIds = ['scroll-hero', 'scroll-about', 'scroll-museum', 'scroll-stack', 'scroll-contact'];

const observer = new IntersectionObserver(
  (entries) => {
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
  },
  { threshold: 0.5 }
);

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
