// Browser QA for the design concepts (Playwright, Chromium).
// Usage:  node tools/serve.js   (in another terminal)
//         NODE_PATH=<global node_modules> node tools/qa.js [routes...] [--shots] [--previews]
// Checks per route × viewport: console errors, page errors, failed requests (4xx/5xx, network), horizontal overflow.
// --shots     full-page screenshots into tools/qa-output/
// --previews  1440×900 viewport JPEGs into agency-active/design-concepts/previews/ (gallery thumbnails)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE || 'http://localhost:8080';
const args = process.argv.slice(2);
const shots = args.includes('--shots');
const previews = args.includes('--previews');
let routes = args.filter(a => !a.startsWith('--')).map(r => '/' + r.replace(/^\/+/, ''));
if (!routes.length) routes = ['/design-concepts/', ...'abcdefghijklm'.split('').map(c => `/design-concepts/concept-${c}/`)];
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1920, height: 1080 }
];
const OUT = path.join(__dirname, 'qa-output');
const PREV = path.join(__dirname, '..', 'agency-active', 'design-concepts', 'previews');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PREV, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  let problems = 0;
  for (const route of routes) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: shots ? 'reduce' : 'no-preference' });
      const page = await ctx.newPage();
      const issues = [];
      page.on('console', m => { if (m.type() === 'error') issues.push('console: ' + m.text()); });
      page.on('pageerror', e => issues.push('pageerror: ' + e.message));
      page.on('requestfailed', r => { if (!r.url().startsWith('mailto:')) issues.push('requestfailed: ' + r.url() + ' ' + (r.failure() || {}).errorText); });
      page.on('response', r => { if (r.status() >= 400) issues.push('http ' + r.status() + ': ' + r.url()); });
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      // reveal all scroll-triggered content before measuring/screenshotting
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
        scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => {
        const w = document.documentElement.clientWidth;
        const off = [];
        document.querySelectorAll('body *').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > w + 1 && getComputedStyle(el).position !== 'fixed') {
            let p = el.parentElement, clipped = false;
            while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') { clipped = true; break; } p = p.parentElement; }
            if (!clipped) off.push((el.className && el.className.baseVal === undefined ? el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] : el.tagName.toLowerCase()) + '→' + Math.round(r.right));
          }
        });
        return { scrollW: document.documentElement.scrollWidth, w, off: off.slice(0, 6) };
      });
      if (overflow.scrollW > overflow.w) issues.push(`overflow: scrollWidth ${overflow.scrollW} > ${overflow.w} ${overflow.off.join(', ')}`);
      const slug = route.replace(/\/$/, '').split('/').pop() || 'root';
      if (shots) await page.screenshot({ path: path.join(OUT, `${slug}-${vp.name}.png`), fullPage: true });
      if (previews && vp.name === 'laptop') {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.addStyleTag({ content: '.dc-sw{display:none!important}' });
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(1200);
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(PREV, `${slug}.jpg`), type: 'jpeg', quality: 78 });
      }
      console.log(`${issues.length ? '✗' : '✓'} ${route} @${vp.name}${issues.length ? '\n   ' + issues.join('\n   ') : ''}`);
      problems += issues.length;
      await ctx.close();
    }
  }
  await browser.close();
  console.log(problems ? `\n${problems} issue(s)` : '\nAll checks passed');
  process.exit(problems ? 1 : 0);
})();
