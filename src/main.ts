import { isMobile } from '@/core/Mobile';
import { isReducedMotion } from '@/core/Reduced';

if (isMobile() || isReducedMotion()) {
  await import('@/main-mobile');
} else {
  const { Engine } = await import('@/core/Engine');
  const engine = new Engine();
  engine.start();
}
