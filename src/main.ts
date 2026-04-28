import { Engine } from '@/core/Engine';
import { isMobile } from '@/core/Mobile';

if (isMobile()) {
  // F8: aqui ele vai redirect pra main-mobile
  console.log('mobile detected — versão simplificada será carregada na F8');
}

const engine = new Engine();
engine.start();
