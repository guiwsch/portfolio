import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PerspectiveCamera } from 'three';

gsap.registerPlugin(ScrollTrigger);

export class ScrollFlow {
  private camera: PerspectiveCamera;

  constructor(camera: PerspectiveCamera) {
    this.camera = camera;
  }

  setupHero(): void {
    ScrollTrigger.create({
      trigger: '#scroll-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const t = self.progress;
        this.camera.position.z = 80 - t * 68;
      }
    });
  }

  setupAbout(onEnter: () => void, onExit: () => void): void {
    ScrollTrigger.create({
      trigger: '#scroll-about',
      start: 'top center',
      end: 'bottom center',
      onEnter,
      onLeaveBack: onExit
    });
  }

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
        this.camera.position.set(0, 1, 20 - t * 80);
        this.camera.lookAt(0, 1, this.camera.position.z - 10);
      }
    });
  }

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

  destroy(): void {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
}
