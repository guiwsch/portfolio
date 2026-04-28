import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PerspectiveCamera } from 'three';

gsap.registerPlugin(ScrollTrigger);

export type SectionCallbacks = {
  onEnter: () => void;
  onLeave: () => void;
};

export class ScrollFlow {
  private camera: PerspectiveCamera;

  constructor(camera: PerspectiveCamera) {
    this.camera = camera;
  }

  setupHero(cb: SectionCallbacks): void {
    ScrollTrigger.create({
      trigger: '#scroll-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onEnter: cb.onEnter,
      onEnterBack: cb.onEnter,
      onLeave: cb.onLeave,
      onLeaveBack: cb.onLeave,
      onUpdate: (self) => {
        const t = self.progress;
        this.camera.position.z = 80 - t * 68;
      }
    });
  }

  setupAbout(cb: SectionCallbacks): void {
    ScrollTrigger.create({
      trigger: '#scroll-about',
      start: 'top center',
      end: 'bottom center',
      onEnter: cb.onEnter,
      onEnterBack: cb.onEnter,
      onLeave: cb.onLeave,
      onLeaveBack: cb.onLeave
    });
  }

  setupMuseum(cb: SectionCallbacks): void {
    ScrollTrigger.create({
      trigger: '#scroll-museum',
      start: 'top center',
      end: 'bottom center',
      scrub: 1.5,
      onEnter: cb.onEnter,
      onEnterBack: cb.onEnter,
      onLeave: cb.onLeave,
      onLeaveBack: cb.onLeave,
      onUpdate: (self) => {
        const t = self.progress;
        this.camera.position.set(2.5, 2, 18 - t * 65);
        this.camera.lookAt(0, 2, this.camera.position.z - 8);
      }
    });
  }

  setupStack(cb: SectionCallbacks): void {
    ScrollTrigger.create({
      trigger: '#scroll-stack',
      start: 'top center',
      end: 'bottom center',
      onEnter: cb.onEnter,
      onEnterBack: cb.onEnter,
      onLeave: cb.onLeave,
      onLeaveBack: cb.onLeave
    });
  }

  setupContact(cb: SectionCallbacks): void {
    ScrollTrigger.create({
      trigger: '#scroll-contact',
      start: 'top center',
      end: 'bottom center',
      onEnter: cb.onEnter,
      onEnterBack: cb.onEnter,
      onLeave: cb.onLeave,
      onLeaveBack: cb.onLeave
    });
  }

  destroy(): void {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
}
