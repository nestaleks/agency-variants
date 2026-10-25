// Concept H — Nocturno: showreel, scenes, homes dialog, cinematic lightbox, interest prefill, mobile menu, form.
module.exports = async ({ page, browser, ok, formTest, BASE }) => {
  // showreel
  ok(await page.locator('[data-ticks] .tick').count() === 5, 'showreel has 5 residences');
  await page.locator('[data-play]').click();
  ok((await page.locator('[data-play]').getAttribute('aria-label')) === 'Play showreel' && await page.locator('#reel.is-paused').count() === 1, 'pause button stops the showreel (WCAG 2.2.2)');
  await page.locator('[data-tick="2"]').click();
  ok((await page.locator('[data-credit-name]').textContent()) === 'Can Marquès' && (await page.locator('[data-tick="2"]').getAttribute('aria-current')) === 'true', 'tick jumps to Can Marquès credit');

  // scenes
  ok(await page.locator('.film').count() === 5, '5 residence scenes rendered');

  // homes dialog + plan in lightbox (nested), Esc closes topmost first
  const opener = page.locator('[data-homes-open="marina-residence"]');
  await opener.scrollIntoViewIfNeeded();
  await opener.click();
  ok(await page.locator('dialog[data-homes][open] [data-homes-rows] tr').count() === 9, 'homes dialog lists 9 Marina homes');
  ok(await page.locator('dialog[data-homes][open] td.is-req', { hasText: 'Price on request' }).count() === 9, 'in-progress homes show “Price on request”');
  await page.locator('dialog[data-homes] [data-plan="0"]').click();
  await page.waitForSelector('[data-lbx-img][src]', { timeout: 3000 }).catch(() => {}); // src is set once the image has loaded
  ok(await page.locator('dialog[data-lbx][open]').count() === 1 && (await page.locator('[data-lbx-img]').getAttribute('src')).includes('apart1'), 'plan opens in lightbox over the dialog');
  await page.keyboard.press('Escape');
  ok(await page.locator('dialog[data-lbx][open]').count() === 0 && await page.locator('dialog[data-homes][open]').count() === 1, 'Esc closes lightbox, homes dialog stays');
  await page.keyboard.press('Escape');
  ok(await page.locator('dialog[open]').count() === 0, 'second Esc closes homes dialog');
  await page.locator('[data-homes-open="solivar"]').click();
  ok(await page.locator('dialog[data-homes][open] td.is-sold', { hasText: 'Sold' }).count() === 7, 'sold project homes marked “Sold”');
  await page.keyboard.press('Escape');

  // cinematic gallery lightbox
  const g = page.locator('[data-gallery-open="can-marques"]');
  await g.scrollIntoViewIfNeeded();
  await g.click();
  const count = async () => (await page.locator('.lbx__count').textContent()).replace(/\s+/g, ' ').trim();
  ok(await count() === '01 / 06', 'lightbox counter “01 / 06”');
  await page.keyboard.press('ArrowRight');
  ok(await count() === '02 / 06', '→ advances to 02');
  await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft');
  ok(await count() === '06 / 06', '← wraps to 06');
  await page.locator('[data-thumb="2"]').click();
  ok(await count() === '03 / 06' && (await page.locator('[data-thumb="2"]').getAttribute('aria-current')) === 'true', 'thumbnail strip jumps to 03');
  await page.waitForTimeout(300);
  ok((await page.locator('[data-lbx-img]').getAttribute('alt')).length > 10, 'lightbox image has descriptive alt');
  await page.keyboard.press('Escape');
  ok(await page.locator('dialog[open]').count() === 0 && await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-gallery-open') === 'can-marques'), 'Esc closes lightbox and focus returns to its button');

  // interest prefill from a scene
  await page.locator('#film-foners-club [data-interest]').click();
  await page.waitForTimeout(400);
  ok((await page.inputValue('#interest')) === 'Foners Club', 'scene “Private viewing” prefills interest');

  // mobile menu
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + 'concept-h/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click(); await m.waitForTimeout(600);
  ok(await m.locator('[data-nav].is-open a').first().isVisible() && (await m.locator('[data-menu]').getAttribute('aria-expanded')) === 'true', 'H mobile menu opens');
  await m.keyboard.press('Escape'); await m.waitForTimeout(600);
  ok(!(await m.locator('[data-nav] a').first().isVisible()) && (await m.locator('[data-menu]').getAttribute('aria-expanded')) === 'false', 'H Esc closes mobile menu');
  const small = await m.$$eval('a, button', els => els.filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && s.visibility !== 'hidden' && r.height < 32 && !e.closest('.dc-sw, .sr'); }).map(e => e.textContent.trim().slice(0, 30)));
  ok(small.length === 0, 'H mobile: no interactive targets under 32px tall' + (small.length ? ' → ' + small.join(' | ') : ''));
  await m.close();

  await formTest(page, 'H');
};
