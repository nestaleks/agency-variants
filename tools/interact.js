// Interaction & navigation tests for the gallery and concepts (Playwright, Chromium).
// Usage: node tools/serve.js  (other terminal), then  NODE_PATH=<global node_modules> node tools/interact.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.env.BASE || 'http://localhost:8080/';
let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  ✓ ' + msg); } else { fail++; console.log('  ✗ ' + msg); } }

async function formTest(page, label) {
  await page.locator('#contact, #write, #enquire, #hello').first().scrollIntoViewIfNeeded();
  await page.locator('[data-tid-form] [type="submit"]').click();
  ok(await page.locator('#name[aria-invalid="true"]').count() === 1, label + ': empty submit marks name invalid');
  ok(await page.locator('#email-error:not([hidden])').count() === 1, label + ': email error message visible');
  ok(await page.evaluate(() => document.activeElement && document.activeElement.id === 'name'), label + ': focus moved to first invalid field');
  await page.fill('#name', 'Test Person');
  await page.fill('#email', 'not-an-email');
  await page.locator('#email').blur();
  ok((await page.locator('#email-error').textContent()).includes('valid email'), label + ': invalid email message');
  await page.fill('#email', 'test@example.com');
  await page.check('#consent');
  await page.locator('[data-tid-form] [type="submit"]').click();
  await page.waitForTimeout(300);
  ok((await page.locator('[data-form-status]').textContent()).includes('Thank you'), label + ': valid submit shows confirmation');
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 800 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => { fail++; console.log('  ✗ pageerror: ' + e.message); });

  console.log('Gallery');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  for (const c of 'abcdefghijklm') {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.locator(`#${c} .open`).click();
    await page.waitForLoadState('networkidle');
    ok(page.url().endsWith(`/concept-${c}/`), `card ${c.toUpperCase()} opens /concept-${c}/`);
    ok(await page.locator(`html[data-concept="${c}"]`).count() === 1, `concept ${c.toUpperCase()} page identity`);
    ok(await page.locator('.dc-sw a[aria-current="page"]').count() === 1, `switcher marks current concept ${c.toUpperCase()}`);
    await page.locator('.dc-sw__back').click();
    await page.waitForLoadState('networkidle');
    ok(page.url() === BASE, `“Gallery” link returns from ${c.toUpperCase()}`);
  }
  for (const el of await page.$$('.concept__shot img')) { await el.scrollIntoViewIfNeeded(); }
  await page.waitForTimeout(800);
  const imgs = await page.$$eval('.concept__shot img', els => els.map(i => i.naturalWidth));
  ok(imgs.length === 13 && imgs.every(w => w > 0), 'all 13 preview images load');

  console.log('Concept A');
  await page.goto(BASE + 'concept-a/', { waitUntil: 'networkidle' });
  ok(await page.locator('.chapter').count() === 5, '5 project chapters rendered');
  await page.locator('[data-filter="sold"]').click();
  ok(await page.locator('.chapter:not([hidden])').count() === 2, 'filter “Completed” shows 2');
  await page.locator('[data-filter="all"]').click();
  await page.locator('[data-open-units="marina-residence"]').click();
  ok(await page.locator('dialog[open] .utable tbody tr:not(.uplan-row)').count() === 9, 'units dialog lists 9 Marina apartments');
  await page.locator('dialog[open] .plan-b').first().click();
  ok(await page.locator('dialog[open] .uplan img').count() === 1, 'floor plan expands');
  await page.keyboard.press('Escape');
  ok(await page.locator('dialog[open]').count() === 0, 'Esc closes dialog');
  await page.locator('.thumbs button').nth(1).click();
  ok(await page.locator('.thumbs button').nth(1).getAttribute('aria-pressed') === 'true', 'thumbnail switcher');
  await formTest(page, 'A');

  console.log('Concept B');
  await page.goto(BASE + 'concept-b/', { waitUntil: 'networkidle' });
  ok(await page.locator('.ft').count() === 5, '5 features rendered');
  await page.locator('#f-foners-club .ft__units summary').click();
  ok(await page.locator('#f-foners-club .ft__units[open] tbody tr').count() === 4, 'apartments disclosure lists 4 units');
  await page.locator('.toc__a').first().click();
  await page.waitForTimeout(800);
  ok(await page.evaluate(() => { const r = document.querySelector('#f-marina-residence').getBoundingClientRect(); return r.top < 200 && r.bottom > 0; }), 'contents link scrolls to feature');
  await formTest(page, 'B');

  console.log('Concept C');
  await page.goto(BASE + 'concept-c/', { waitUntil: 'networkidle' });
  const count = async () => +(await page.locator('[data-count] b').textContent());
  ok(await count() === 22, 'default: 22 apartments (sold hidden)');
  await page.locator('label.switch:has(#available)').click();
  ok(await count() === 37, 'show sold → 37');
  await page.locator('label[for="beds-3"]').click();
  ok(await count() === 16, '3+ bedrooms → 16 (5 S’Olivar + 4 Boho + 4 Foners + 2 Marina + 1 Can Marquès)');
  await page.locator('[data-sort="area"]').click();
  const areas = await page.$$eval('[data-tbody] td[data-l="Area"]', t => t.map(x => parseFloat(x.textContent.replace(/,/g, ''))));
  ok(areas.every((a, i) => i === 0 || a >= areas[i - 1]), 'sort by area ascending');
  await page.locator('.rowbtn').first().click();
  ok(await page.locator('dialog[open] [data-d-plan]').count() === 1, 'unit drawer opens with plan');
  await page.locator('[data-d-next]').click();
  ok((await page.locator('[data-d-title]').textContent()).startsWith('Apartment'), 'drawer next works');
  await page.locator('[data-d-request]').click();
  await page.waitForTimeout(500);
  ok((await page.inputValue('#message')).length > 20, 'request prefills message');
  await page.locator('#tab-sold').click();
  ok(await page.locator('#panel-sold:not([hidden]) .pcard').count() === 2, 'Completed tab shows 2 projects');
  await page.locator('[data-filter-to="boho-corner"]').click();
  ok(await count() === 8, '“See its apartments” filters finder to 8');
  await formTest(page, 'C');

  console.log('Concept D');
  await page.goto(BASE + 'concept-d/', { waitUntil: 'networkidle' });
  await page.locator('[data-w="marina-residence"]').click();
  ok((await page.locator('[data-w-name]').textContent()) === 'Marina Residence', 'works selector updates detail');
  ok(await page.locator('[data-w-bars] li').count() === 9, 'area bars for 9 homes');
  await page.locator('[data-view="plan"]').click();
  ok((await page.locator('[data-w-img]').getAttribute('src')).includes('plan'), 'drawing toggle shows plan');
  await formTest(page, 'D');

  console.log('Concept E');
  await page.goto(BASE + 'concept-e/', { waitUntil: 'networkidle' });
  await page.locator('[data-toggle]').click();
  ok(await page.locator('[data-panel].is-open').count() === 1, 'menu opens');
  await page.keyboard.press('Escape');
  ok(await page.locator('[data-panel].is-open').count() === 0, 'Esc closes menu');
  const sl0 = await page.$eval('[data-reel]', r => r.scrollLeft);
  await page.locator('[data-next]').click(); await page.waitForTimeout(800);
  ok(await page.$eval('[data-reel]', r => r.scrollLeft) > sl0, 'reel next scrolls');
  await page.locator('[data-open="foners-club"]').click();
  ok(await page.locator('dialog[open] [data-pm-name]').textContent() === 'Foners Club', 'project modal opens');
  await page.locator('[data-pm-next]').click();
  ok((await page.locator('[data-pm-count]').textContent()).startsWith('Photo 2'), 'modal slider next');
  await page.keyboard.press('Escape');
  await page.locator('[data-stabs] [role="tab"]').nth(2).click();
  ok(await page.locator('#sp-2:not([hidden])').count() === 1, 'service tab switches panel');
  await formTest(page, 'E');

  // Concepts F–M keep their tests next to each other in tools/tests/concept-<x>.js
  for (const c of 'fghijklm') {
    const f = path.join(__dirname, 'tests', `concept-${c}.js`);
    if (!fs.existsSync(f)) { fail++; console.log('  ✗ missing ' + f); continue; }
    console.log('Concept ' + c.toUpperCase());
    await page.goto(BASE + `concept-${c}/`, { waitUntil: 'networkidle' });
    await require(f)({ page, browser, ok, formTest, BASE });
  }

  console.log('Mobile menus (390px)');
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + 'concept-a/', { waitUntil: 'networkidle' });
  await m.locator('[data-nav-btn]').click(); await m.waitForTimeout(700);
  ok(await m.locator('[data-nav-list].is-open').isVisible(), 'A mobile menu opens');
  await m.goto(BASE + 'concept-b/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click(); await m.waitForTimeout(600);
  ok(await m.locator('[data-nav].is-open a').first().isVisible(), 'B mobile index opens');
  await m.goto(BASE + 'concept-c/', { waitUntil: 'networkidle' });
  await m.locator('[data-burger]').click(); await m.waitForTimeout(400);
  ok(await m.locator('[data-nav].is-open a').first().isVisible(), 'C mobile menu opens');
  await m.goto(BASE + 'concept-d/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click();
  ok(await m.locator('[data-nav].is-open a').first().isVisible(), 'D mobile menu opens');
  const small = await m.$$eval('a, button', els => els.filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && s.visibility !== 'hidden' && r.height < 32 && !e.closest('.sr'); }).map(e => e.textContent.trim().slice(0, 30)));
  ok(small.length === 0, 'D mobile: no interactive targets under 32px tall' + (small.length ? ' → ' + small.join(' | ') : ''));

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
