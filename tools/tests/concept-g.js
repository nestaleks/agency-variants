// Concept G — Obra: site board, ticker, status filter, unit tables, plan viewer (zoom / pan / keyboard), mobile menu, form.
module.exports = async ({ page, browser, ok, formTest, BASE }) => {
  ok(await page.locator('[data-board] li').count() === 5, 'site board lists 5 projects');
  ok((await page.locator('[data-board-total]').textContent()).trim() === '37', 'site board totals 37 homes');

  const btn = page.locator('[data-ticker-btn]');
  await btn.click();
  ok(await btn.getAttribute('aria-pressed') === 'true' &&
     await page.$eval('[data-ticker-track]', t => getComputedStyle(t).animationPlayState) === 'paused', 'ticker pause button stops the marquee');
  await btn.click();

  await page.locator('[data-filter="sold"]').click();
  ok(await page.locator('.sheet:not([hidden])').count() === 2, 'filter “Sold” shows 2 spec sheets');
  await page.locator('[data-filter="all"]').click();
  ok(await page.locator('.sheet:not([hidden])').count() === 5, 'filter “All” shows 5 spec sheets');

  const units = page.locator('#p-marina-residence [data-units]');
  await units.click();
  ok(await units.getAttribute('aria-expanded') === 'true' && await page.locator('#u-marina-residence tbody tr').count() === 9, 'unit table expands with 9 Marina apartments');

  await page.locator('#u-marina-residence .planbtn').nth(2).click();
  ok(await page.locator('dialog[open] [data-pv-title]').textContent() === 'Apartment 03', 'plan viewer opens on apartment 03');
  ok((await page.locator('[data-pv-img]').getAttribute('src')).endsWith('apart3.jpg'), 'plan viewer shows the unit floor plan');
  await page.keyboard.press('+');
  ok((await page.locator('[data-pv-lvl]').textContent()) === '150%', '“+” key zooms in');
  const box = await page.locator('[data-pv-stage]').boundingBox();
  const t0 = await page.$eval('[data-pv-img]', i => i.style.transform);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 40, { steps: 5 });
  await page.mouse.up();
  ok(await page.$eval('[data-pv-img]', i => i.style.transform) !== t0, 'drag pans the zoomed plan');
  await page.locator('[data-pv-zoom="-1"]').click();
  ok((await page.locator('[data-pv-lvl]').textContent()) === '100%', 'zoom-out button returns to 100%');
  await page.keyboard.press('ArrowRight');
  ok(await page.locator('[data-pv-title]').textContent() === 'Apartment 04', '→ key moves to next unit');
  await page.locator('[data-pv-step="-1"]').click();
  ok(await page.locator('[data-pv-count]').textContent() === '3 / 9', 'Prev button steps back');
  await page.keyboard.press('Escape');
  ok(await page.locator('dialog[open]').count() === 0, 'Esc closes plan viewer');
  ok(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('planbtn')), 'focus returns to the Plan button');

  await page.locator('#u-marina-residence .planbtn').first().click();
  await page.locator('[data-pv-cta]').click();
  await page.waitForTimeout(400);
  ok(await page.inputValue('#interest') === 'Marina Residence' && (await page.inputValue('#message')).includes('apartment 1'), 'plan CTA prefills interest and message');
  await page.fill('#message', '');

  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + 'concept-g/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click();
  ok(await m.locator('[data-nav].is-open a').first().isVisible() && await m.locator('[data-menu]').getAttribute('aria-expanded') === 'true', 'G mobile menu opens');
  await m.keyboard.press('Escape');
  ok(!(await m.locator('[data-nav] a').first().isVisible()), 'G Esc closes mobile menu');
  await m.close();

  await formTest(page, 'G');
};
