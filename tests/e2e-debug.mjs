import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const errors = [];
page.on('pageerror', (err) => errors.push(err.toString()));
page.on('requestfailed', (req) => {
  if (!req.url().includes('/audio/')) errors.push(`REQ FAIL: ${req.url()}`);
});

await page.goto('http://localhost:5177', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(2000);

const total = await page.evaluate(() => document.body.scrollHeight);
const wh = await page.evaluate(() => window.innerHeight);
console.log(`Total scroll: ${total}px, viewport: ${wh}px`);

// 5 posições de scroll: hero, about, museum, stack, contact
const positions = [
  { name: 'hero', y: 0 },
  { name: 'about', y: Math.floor(total * 0.18) },
  { name: 'museum-start', y: Math.floor(total * 0.35) },
  { name: 'museum-mid', y: Math.floor(total * 0.55) },
  { name: 'stack', y: Math.floor(total * 0.78) },
  { name: 'contact', y: Math.floor(total * 0.95) }
];

for (const p of positions) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), p.y);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/tmp/scene-${p.name}.png` });
  const visibleOverlays = await page.evaluate(() => {
    const els = ['.hero-title', '.bio-overlay', '.contact-overlay'];
    return els.map((sel) => {
      const el = document.querySelector(sel);
      if (!el) return `${sel}: missing`;
      const op = parseFloat(getComputedStyle(el).opacity);
      return `${sel}: ${op.toFixed(2)}`;
    });
  });
  console.log(`[${p.name} @ ${p.y}] overlays: ${visibleOverlays.join(' | ')}`);
}

console.log('\n=== Errors ===');
errors.forEach((e) => console.log(e));

await browser.close();
