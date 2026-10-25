// Lightweight accessibility scan (not a substitute for axe/manual testing):
// missing alt, unnamed buttons/links, heading-level skips, duplicate ids, inputs without labels, missing lang.
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8080/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1366, height: 800 } });
  let total = 0;
  for (const r of ['', 'concept-a/', 'concept-b/', 'concept-c/', 'concept-d/', 'concept-e/', 'concept-f/', 'concept-g/', 'concept-h/', 'concept-i/', 'concept-j/', 'concept-k/', 'concept-l/', 'concept-m/']) {
    await p.goto(BASE + r, { waitUntil: 'networkidle' });
    const res = await p.evaluate(() => {
      const out = [];
      if (!document.documentElement.lang) out.push('html without lang');
      document.querySelectorAll('img:not([alt])').forEach(i => out.push('img without alt: ' + i.src.split('/').pop()));
      document.querySelectorAll('button, a[href]').forEach(e => {
        const name = (e.getAttribute('aria-label') || e.textContent || '').trim() || (e.querySelector('img[alt]:not([alt=""])') ? 'img' : '');
        if (!name && !e.closest('[aria-hidden="true"]')) out.push('unnamed ' + e.tagName.toLowerCase() + ': ' + e.outerHTML.slice(0, 80));
      });
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => !h.closest('dialog'));
      let prev = 0; hs.forEach(h => { const l = +h.tagName[1]; if (prev && l > prev + 1) out.push(`heading skip h${prev}→h${l}: ${h.textContent.trim().slice(0, 40)}`); prev = l; });
      if (document.querySelectorAll('h1').length !== 1) out.push('h1 count ' + document.querySelectorAll('h1').length);
      const ids = {}; document.querySelectorAll('[id]').forEach(e => { ids[e.id] = (ids[e.id] || 0) + 1; });
      Object.keys(ids).filter(k => ids[k] > 1).forEach(k => out.push('duplicate id: ' + k));
      document.querySelectorAll('input:not([type=hidden]), select, textarea').forEach(i => {
        if (!(i.labels && i.labels.length) && !i.getAttribute('aria-label')) out.push('unlabelled field: ' + (i.id || i.name));
      });
      return out;
    });
    console.log((res.length ? '✗ ' : '✓ ') + '/' + r + (res.length ? '\n   ' + res.join('\n   ') : ''));
    total += res.length;
  }
  await b.close(); console.log(total ? `${total} finding(s)` : 'No findings'); process.exit(total ? 1 : 0);
})();
