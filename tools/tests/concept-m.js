// Concept M — Dossier: computed cover facts, SVG charts from unit data (strip plot keyboard + tooltip + table alternative),
// exhibits with unit schedules, print one-pager, mobile menu, form.
module.exports = async ({ page, browser, ok, formTest, BASE }) => {
  ok((await page.locator('[data-cover-homes2]').textContent()).trim() === '37', 'cover particulars compute 37 published homes');
  ok(await page.locator('.toc a').count() === 6 && await page.locator('[data-plates] li').count() === 5, 'cover has 6-entry contents and 5 plates');

  ok(await page.locator('[data-chart-bars] .bar').count() === 5, 'Figure 1 draws 5 bars');
  const marks = page.locator('[data-chart-strip] .mk');
  const nMarks = await marks.count();
  const represented = await page.$$eval('[data-chart-strip] .mk', ms => ms.reduce((a, m) => a + (m.querySelector('.mk__n') ? +m.querySelector('.mk__n').textContent : 1), 0));
  ok(nMarks > 20 && represented === 37, 'Figure 2 marks represent all 37 homes (' + nMarks + ' marks)');

  await page.locator('[data-chart-strip]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await marks.first().hover();
  ok(await page.locator('[data-tip]:not([hidden])').count() === 1 && (await page.locator('[data-tip]').textContent()).includes('m²'), 'hovering a mark shows the tooltip');
  await marks.first().focus();
  await page.keyboard.press('ArrowRight');
  ok(await page.evaluate(() => document.activeElement.classList.contains('mk')) && await marks.nth(1).getAttribute('tabindex') === '0', '→ moves focus to the next mark (roving tabindex)');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(900);
  const hl = await page.locator('.sched tr.is-hl').first().getAttribute('id');
  ok(hl && hl.startsWith('u-marina-residence-'), 'Enter on a mark highlights its unit row in the exhibit (' + hl + ')');

  const tbtn = page.locator('[data-strip-toggle]');
  await tbtn.click();
  ok(await tbtn.getAttribute('aria-expanded') === 'true' && await page.locator('[data-strip-table] tbody tr').count() === 37, 'table alternative shows 37 rows');
  await tbtn.click();
  ok(await page.locator('#strip-table').isHidden(), 'table alternative hides again');

  ok(await page.locator('.ex').count() === 5 && await page.locator('#ex-can-marques .sched tbody tr').count() === 9, '5 exhibits; Can Marquès schedule lists 9 homes');
  ok(await page.locator('#ex-solivar .st--sold').count() === 7 && (await page.locator('#ex-marina-residence .sched tbody').textContent()).includes('Price on request'), 'sold homes read “Sold”, available read “Price on request”');

  await page.evaluate(() => { window.__printed = []; window.print = () => window.__printed.push({ one: document.documentElement.classList.contains('print-one'), target: (document.querySelector('.ex.is-print') || {}).id || null }); });
  await page.locator('[data-print-one="foners-club"]').click();
  const pr = await page.evaluate(() => window.__printed[0]);
  ok(pr && pr.one && pr.target === 'ex-foners-club', 'Download one-pager prints only exhibit 2.2');
  await page.emulateMedia({ media: 'print' });
  const vis = await page.evaluate(() => ({ ex: [...document.querySelectorAll('.ex')].filter(e => getComputedStyle(e).display !== 'none').map(e => e.id), cover: getComputedStyle(document.querySelector('.cover')).display, head: getComputedStyle(document.querySelector('.print-head')).display }));
  ok(vis.ex.length === 1 && vis.ex[0] === 'ex-foners-club' && vis.cover === 'none' && vis.head !== 'none', 'print stylesheet shows only the chosen exhibit with the dossier header');
  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  ok(!(await page.evaluate(() => document.documentElement.classList.contains('print-one'))), 'afterprint restores the full dossier');

  await page.locator('#ex-foners-club a[data-interest]').click();
  ok(await page.inputValue('#interest') === 'Foners Club', 'exhibit enquiry prefills the subject');

  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + 'concept-m/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click();
  ok(await m.locator('[data-nav].is-open a').first().isVisible() && await m.locator('[data-menu]').getAttribute('aria-expanded') === 'true', 'M mobile menu opens');
  await m.keyboard.press('Escape');
  ok(!(await m.locator('[data-nav] a').first().isVisible()) && await m.evaluate(() => document.activeElement.hasAttribute('data-menu')), 'M Esc closes mobile menu and returns focus');
  await m.close();

  await formTest(page, 'M');
};
