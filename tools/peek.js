// Viewport screenshots at given selectors/scroll positions. Usage: node tools/peek.js <route> <width> <height> <out-prefix> [selector|y ...]
const { chromium } = require('playwright');
(async () => {
  const [route, w, h, out, ...targets] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h } });
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.goto('http://localhost:8080/' + route.replace(/^\/+/, ''), { waitUntil: 'networkidle' });
  let i = 0;
  for (const t of (targets.length ? targets : ['0'])) {
    if (/^\d+$/.test(t)) await p.evaluate(y => scrollTo(0, y), +t);
    else await p.evaluate(s => { const el = document.querySelector(s); if (el) el.scrollIntoView(); }, t);
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${out}-${i++}.png` });
  }
  await b.close(); console.log('done');
})();
