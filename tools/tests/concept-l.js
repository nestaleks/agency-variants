// Concept L — Agua: caustics pause, render/plan reveal (keyboard + drag), depth property, project dialog with bedroom filter, mobile menu, form.
module.exports = async ({ page, browser, ok, formTest, BASE }) => {
  ok(await page.locator('.pcard').count() === 5, '5 project glass cards rendered');
  ok(await page.locator('.sgroup').count() === 3 && await page.locator('.tile').count() === 12, '12 services in 3 groups (Build / Buy & sell / Advise)');
  ok(await page.locator('.marker').count() === 4, 'process shows 4 depth markers');
  ok(await page.locator('#p-can-marques .chip--water').count() >= 1 && await page.locator('#p-boho-corner .chip--water', { hasText: 'Pool' }).count() === 0, 'water chips only where real (pool at Can Marquès, none at Boho Corner)');

  // caustics pause control (WCAG 2.2.2)
  const pause = page.locator('[data-caustics-btn]');
  await pause.click();
  ok(await pause.getAttribute('aria-pressed') === 'true' && (await pause.textContent()).includes('Play'), 'water-light animation can be paused');
  await pause.click();

  // render / plan reveal — keyboard
  const card = page.locator('#p-foners-club');
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1900); // let the one-time nudge finish
  const range = card.locator('.reveal__range');
  await range.focus();
  await page.keyboard.press('End');
  ok(await range.inputValue() === '100' && (await card.locator('[data-reveal]').evaluate(r => r.style.getPropertyValue('--pos').trim())) === '100%', 'End key reveals the full plan');
  ok((await range.getAttribute('aria-valuetext')) === 'Plan 100%, render 0%', 'slider announces plan/render share');
  await page.keyboard.press('Home');
  ok(await range.inputValue() === '0', 'Home key returns to the render');
  // drag
  const box = await card.locator('[data-reveal]').boundingBox();
  await page.mouse.move(box.x + box.width * 0.1, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2, { steps: 6 });
  await page.mouse.up();
  const v = +(await range.inputValue());
  ok(v >= 70 && v <= 80, 'dragging across the image moves the reveal (' + v + '%)');

  // depth custom property
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const deep = await page.evaluate(() => +getComputedStyle(document.documentElement).getPropertyValue('--depth'));
  ok(deep > 0.9 && await page.locator('[data-hd].is-deep').count() === 1, '--depth reaches the abyss at the bottom and header turns deep');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
  ok(await page.evaluate(() => +getComputedStyle(document.documentElement).getPropertyValue('--depth')) < 0.05, '--depth returns to the surface at the top');

  // project dialog
  const opener = page.locator('[data-open="marina-residence"]');
  await opener.click();
  ok(await page.locator('dialog[open] [data-pd-title]').textContent() === 'Marina Residence', 'project dialog opens');
  ok(await page.locator('[data-pd-units] li:not([hidden])').count() === 9, 'dialog lists 9 Marina apartments');
  await page.locator('[data-beds-btn="1"]').click();
  ok(await page.locator('[data-pd-units] li:not([hidden])').count() === 2 && (await page.locator('[data-pd-count]').textContent()) === 'Showing 2 of 9 homes', 'bedroom filter “1 bed” shows 2 homes');
  await page.locator('[data-pd-units] li:not([hidden]) [data-unit-plan]').first().click();
  ok((await page.locator('[data-pd-img]').getAttribute('src')).endsWith('apart4.jpg'), 'unit Plan button shows its floor plan');
  await page.locator('[data-thumb="1"]').click();
  ok((await page.locator('[data-pd-img]').getAttribute('src')).endsWith('gallery-02.jpg') && await page.locator('[data-thumb="1"]').getAttribute('aria-pressed') === 'true', 'gallery thumbnail switches image');
  ok(await page.locator('dialog[open] .unit__price', { hasText: 'Price on request' }).count() >= 1 && await page.locator('dialog[open] :text("€")').count() === 0, 'no prices shown — “Price on request”');
  await page.keyboard.press('Escape');
  ok(await page.locator('dialog[open]').count() === 0, 'Esc closes the dialog');
  ok(await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-open') === 'marina-residence'), 'focus returns to the opener');

  await page.locator('[data-open="solivar"]').click();
  ok(await page.locator('dialog[open] .unit__price', { hasText: 'Sold' }).count() === 7 && await page.locator('dialog[open] [data-leave]').count() === 0, 'sold project: units marked Sold, no unit enquiry');
  await page.keyboard.press('Escape');

  await opener.click();
  await page.locator('[data-pd-units] [data-leave]').nth(2).click();
  await page.waitForTimeout(600);
  ok(await page.locator('dialog[open]').count() === 0 && await page.inputValue('#interest') === 'Marina Residence' && (await page.inputValue('#message')).includes('apartment 3'), 'unit Enquire closes dialog and prefills interest + message');
  await page.fill('#message', '');

  // mobile menu
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + 'concept-l/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click();
  ok(await m.locator('[data-nav].is-open a').first().isVisible() && await m.locator('[data-menu]').getAttribute('aria-expanded') === 'true', 'L mobile menu opens');
  await m.keyboard.press('Escape');
  ok(!(await m.locator('[data-nav] a').first().isVisible()) && await m.locator('[data-menu]').getAttribute('aria-expanded') === 'false', 'L Esc closes mobile menu');
  await m.close();

  await formTest(page, 'L');
};
