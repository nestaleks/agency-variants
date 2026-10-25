// Concept F — Casa de Cal: doorways → room, compare tray (max 3) → side-by-side dialog, trades accordion, mobile menu.
module.exports = async ({ page, browser, ok, formTest, BASE }) => {
  await page.evaluate(() => { try { localStorage.removeItem('tidf-compare'); } catch (e) {} });
  await page.reload({ waitUntil: 'networkidle' });

  ok(await page.locator('[data-door]').count() === 5, 'F: 5 arched doorways rendered');
  ok(await page.locator('[data-room] .unit').count() === 9, 'F: first room (Marina Residence) lists 9 apartments');

  await page.locator('[data-door="foners-club"]').click();
  ok((await page.locator('[data-room] .room__h').textContent()) === 'Foners Club' &&
     await page.locator('[data-door="foners-club"]').getAttribute('aria-pressed') === 'true', 'F: doorway opens the Foners Club room');
  ok(await page.locator('[data-room] .unit').count() === 4, 'F: Foners Club room lists 4 apartments');

  await page.locator('[data-room] [data-photo="2"]').click();
  ok((await page.locator('[data-room-img]').getAttribute('src')).includes('foners-club-gallery-03'), 'F: room thumbnail switches photo');

  // compare tray: add 2 from Foners, 1 from Boho, the 4th is refused
  ok(await page.locator('[data-tray]').isHidden(), 'F: tray hidden while empty');
  await page.locator('[data-cmp="foners-club:1"]').click();
  await page.locator('[data-cmp="foners-club:4"]').click();
  await page.locator('[data-door="boho-corner"]').click();
  await page.locator('[data-cmp="boho-corner:5"]').click();
  ok(await page.locator('[data-tray] .tchip:not(.tchip--empty)').count() === 3, 'F: tray holds 3 apartments from 2 projects');
  await page.locator('[data-cmp="boho-corner:6"]').click();
  ok(await page.locator('[data-tray] .tchip:not(.tchip--empty)').count() === 3 &&
     await page.locator('[data-cmp="boho-corner:6"]').getAttribute('aria-pressed') === 'false', 'F: 4th apartment refused (max 3)');

  await page.locator('[data-compare-open]').click();
  ok(await page.locator('dialog[open] .cmp__t thead th').count() === 3, 'F: compare dialog shows 3 columns');
  ok(await page.locator('dialog[open] .cmp__plan img').count() === 3, 'F: compare dialog shows 3 floor plans');
  await page.keyboard.press('Escape');
  ok(await page.locator('dialog[open]').count() === 0, 'F: Esc closes compare dialog');

  await page.locator('[data-tray-remove="foners-club:1"]').click();
  ok(await page.locator('[data-tray] .tchip:not(.tchip--empty)').count() === 2, 'F: remove from tray');
  await page.locator('[data-compare-open]').click();
  await page.locator('[data-compare-enquire]').click();
  await page.waitForTimeout(600);
  ok((await page.inputValue('#message')).includes('Boho Corner apartment 5'), 'F: “Ask about these homes” prefills the message');

  // plan dialog
  await page.locator('[data-plan-open="boho-corner:5"]').click();
  ok((await page.locator('dialog[open] [data-plan-img]').getAttribute('src')).includes('plan-2a'), 'F: floor-plan dialog opens');
  await page.keyboard.press('Escape');

  // services: trades accordion
  await page.locator('.trade').nth(2).locator('summary').click();
  ok(await page.locator('.trade[open]').count() === 2 && await page.locator('.trade').nth(2).locator('li').count() === 4, 'F: “Advise” trade opens with 4 services');
  ok(await page.locator('.trade__list li').count() === 12, 'F: 12 services in 3 trades');

  // mobile menu
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + 'concept-f/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click(); await m.waitForTimeout(500);
  ok(await m.locator('[data-nav].is-open a').first().isVisible() && await m.locator('[data-menu]').getAttribute('aria-expanded') === 'true', 'F mobile: menu opens');
  await m.keyboard.press('Escape'); await m.waitForTimeout(500);
  ok(await m.locator('[data-nav].is-open').count() === 0 && await m.locator('[data-nav] a').first().isHidden(), 'F mobile: Esc closes menu');
  const small = await m.$$eval('a, button, summary', els => els.filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && s.visibility !== 'hidden' && r.height < 32 && !e.closest('.sr, .dc-sw'); }).map(e => e.textContent.trim().slice(0, 30)));
  ok(small.length === 0, 'F mobile: no interactive targets under 32px tall' + (small.length ? ' → ' + small.join(' | ') : ''));
  await m.close();

  await page.evaluate(() => { try { localStorage.removeItem('tidf-compare'); } catch (e) {} });
  await formTest(page, 'F');
};
