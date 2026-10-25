// Concept K — Postal: poster cards, postcard-back dialog (units, prev/next, ask prefill, Esc), stamps, ticket filter, mobile menu, form.
module.exports = async ({ page, browser, ok, formTest, BASE }) => {
  ok(await page.locator('[data-posters] .pcard').count() === 5, '5 poster cards rendered');
  ok((await page.locator('[data-stat="homes"]').textContent()).trim() === '37', 'hero ticket totals 37 homes from data');
  ok(await page.locator('[data-stamps] .stamp').count() === 4, 'route shows 4 stamps');

  const marina = page.locator('[data-open="marina-residence"]');
  await marina.click();
  ok(await page.locator('dialog[open] [data-pc-name]').textContent() === 'Marina Residence', 'poster turns over into the Marina postcard');
  ok(await page.locator('dialog[open] .unit').count() === 9 &&
     await page.locator('dialog[open] .unit__p', { hasText: 'Price on request' }).count() === 9, 'postcard back lists 9 homes, all “Price on request”');
  await page.locator('[data-pc-step="1"]').click();
  ok(await page.locator('[data-pc-name]').textContent() === 'Foners Club' && await page.locator('dialog[open] .unit').count() === 4, 'Next shows Foners Club with 4 homes');
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
  ok(await page.locator('[data-pc-name]').textContent() === 'S’Olivar' && await page.locator('dialog[open] .unit__p.is-sold').count() === 7, '→ key reaches S’Olivar, every home marked Sold');
  await page.keyboard.press('Escape');
  ok(await page.locator('dialog[open]').count() === 0, 'Esc closes the postcard');
  await page.waitForTimeout(150); // focus is restored in the dialog's async close event
  ok(await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-open') === 'solivar'), 'focus returns to the matching poster');

  await marina.click();
  await page.locator('dialog[open] [data-ask-unit="3"]').click();
  await page.waitForTimeout(600);
  ok(await page.locator('dialog[open]').count() === 0 && await page.inputValue('#interest') === 'Marina Residence' &&
     (await page.inputValue('#message')).includes('apartment 3'), 'unit “Ask” closes postcard and prefills interest + message');
  await page.fill('#message', '');

  await page.locator('[data-filter="Advise"]').click();
  ok(await page.locator('.tkt:not([hidden])').count() === 4 && await page.locator('[data-filter="Advise"]').getAttribute('aria-pressed') === 'true', 'ticket filter “Advise” shows 4 services');
  await page.locator('[data-filter="all"]').click();
  ok(await page.locator('.tkt:not([hidden])').count() === 12, 'filter “All” shows 12 tickets');

  await page.locator('#invest [data-interest]').click();
  ok(await page.inputValue('#interest') === 'Investment consultation', 'investment CTA prefills the subject');

  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + 'concept-k/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click();
  ok(await m.locator('[data-nav].is-open a').first().isVisible() && await m.locator('[data-menu]').getAttribute('aria-expanded') === 'true', 'K mobile menu opens');
  await m.keyboard.press('Escape');
  ok(!(await m.locator('[data-nav] a').first().isVisible()) && await m.locator('[data-menu]').getAttribute('aria-expanded') === 'false', 'K Esc closes mobile menu');
  const small = await m.$$eval('a, button', els => els.filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && s.visibility !== 'hidden' && r.height < 32 && !e.closest('.dc-sw'); }).map(e => e.textContent.trim().slice(0, 30)));
  ok(small.length === 0, 'K mobile: no interactive targets under 32px tall' + (small.length ? ' → ' + small.join(' | ') : ''));
  await m.close();

  await formTest(page, 'K');
};
