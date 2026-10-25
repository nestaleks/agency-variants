// Concept I — Carta Náutica: interactive chart (pins + gazetteer + legend card), filters, route, services, mobile menu, form.
module.exports = async ({ page, browser, ok, formTest, BASE }) => {
  ok(await page.locator('[data-pin]').count() === 5, '5 project pins on the chart');
  ok(await page.locator('[data-pins="inset"] [data-pin]').count() === 4 && await page.locator('[data-pins="island"] [data-pin="solivar"]').count() === 1,
    '4 pins in the Palma inset, S’Olivar on the island locator');

  await page.locator('[data-pin="foners-club"]').click();
  ok((await page.locator('[data-c-name]').textContent()) === 'Foners Club', 'pin opens Foners Club legend card');
  ok(await page.locator('[data-pin="foners-club"][aria-pressed="true"]').count() === 1 &&
     await page.locator('[data-select="foners-club"][aria-pressed="true"]').count() === 1, 'pin and gazetteer row stay in sync');
  ok(await page.locator('[data-c-units] tr').count() === 4, 'units table lists 4 Foners apartments');
  ok((await page.locator('[data-c-units]').textContent()).includes('Price on request'), 'in-progress units show “Price on request”');

  await page.locator('[data-select="solivar"]').click();
  ok((await page.locator('[data-c-name]').textContent()) === 'S’Olivar' && await page.locator('[data-c-units] tr').count() === 7, 'gazetteer selects S’Olivar with 7 units');
  ok((await page.locator('[data-c-coord]').textContent()).includes('39.80'), 'Sóller approx. coordinates shown');

  await page.locator('[data-filter="sold"]').click();
  ok(await page.locator('[data-pin]:not([hidden])').count() === 2 && await page.locator('[data-gaz-item]:not([hidden])').count() === 2, 'filter “Completed” shows 2 pins and 2 rows');
  await page.locator('[data-filter="in-progress"]').click();
  ok(await page.locator('[data-pin]:not([hidden])').count() === 3, 'filter “In progress” shows 3 pins');
  ok((await page.locator('[data-c-name]').textContent()) === 'Marina Residence', 'hidden selection falls back to first visible project');
  await page.locator('[data-filter="all"]').click();

  await page.locator('[data-c-cta]').click();
  await page.waitForTimeout(300);
  ok((await page.inputValue('#interest')) === 'Marina Residence', 'legend CTA prefills enquiry with the project');

  ok(await page.locator('[data-route] .wp').count() === 4, 'route has 4 waypoints');
  ok((await page.locator('[data-route-path]').getAttribute('d') || '').startsWith('M'), 'dotted course line drawn through waypoints');
  ok(await page.locator('[data-services] .lg').count() === 3 && await page.locator('[data-services] dt').count() === 12, '12 services in 3 legends');

  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + 'concept-i/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click();
  ok(await m.locator('[data-nav].is-open a').first().isVisible() && (await m.locator('[data-menu]').getAttribute('aria-expanded')) === 'true', 'I mobile menu opens');
  await m.keyboard.press('Escape');
  ok(await m.locator('[data-nav].is-open').count() === 0, 'I Esc closes mobile menu');
  const small = await m.$$eval('a, button', els => els.filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && s.visibility !== 'hidden' && r.height < 32 && !e.closest('.dc-sw') && !e.classList.contains('skip'); }).map(e => e.textContent.trim().slice(0, 30)));
  ok(small.length === 0, 'I mobile: no interactive targets under 32px' + (small.length ? ' → ' + small.join(' | ') : ''));
  await m.close();

  await formTest(page, 'I');
};
