// Concept J — Hogar Match: bento counts, 3-step home-match quiz, ask-about-home prefill,
// expandable project cards, service filter chips, process stepper, FAQ accordion, mobile menu, form.
module.exports = async ({ page, browser, ok, formTest, BASE }) => {
  ok((await page.locator('[data-count-buildings]').textContent()).trim() === '5', 'hero: 5 buildings computed from data');
  await page.waitForTimeout(1100);
  ok((await page.locator('[data-count-homes]').textContent()).trim() === '37', 'hero: 37 published homes computed from data');

  // quiz — validation, next/back, keyboard
  await page.locator('#match').scrollIntoViewIfNeeded();
  await page.locator('[data-next]').click();
  ok(await page.locator('[data-hint]:not([hidden])').count() === 1, 'quiz: Next without an answer shows hint');
  await page.locator('label:has(input[name="where"][value="sea"])').click();
  await page.locator('[data-next]').click();
  ok(await page.locator('[data-step="1"]:not([hidden])').count() === 1, 'quiz: step 2 shown after answering step 1');
  ok(await page.locator('[data-progress] li:nth-child(2)[aria-current="step"]').count() === 1, 'quiz: progress marks step 2');
  await page.locator('[data-back]').click();
  ok(await page.locator('input[name="where"][value="sea"]:checked').count() === 1 && await page.locator('[data-step="0"]:not([hidden])').count() === 1, 'quiz: Back returns to step 1 and keeps the answer');
  await page.locator('input[name="where"][value="sea"]').focus();
  await page.keyboard.press('Enter');
  ok(await page.locator('[data-step="1"]:not([hidden])').count() === 1, 'quiz: Enter on a focused answer advances (keyboard)');
  await page.locator('label:has(input[name="beds"][value="2"])').click();
  await page.locator('[data-next]').click();
  await page.locator('label:has(input[name="must"][value="outdoor"])').click();
  await page.locator('[data-next]').click();
  await page.waitForTimeout(400);
  const n = await page.locator('[data-rlist] > li').count();
  ok(n > 0 && (await page.locator('[data-quiz-live]').textContent()).includes('match'), 'quiz: results listed (' + n + ') and announced');
  const soldFlags = await page.$$eval('[data-rlist] > li', ls => ls.map(l => l.classList.contains('rcard--sold')));
  ok(soldFlags.every((s, i) => i === 0 || !(soldFlags[i - 1] && !s)), 'quiz: available homes ranked before sold ones');
  ok(await page.locator('[data-rlist] > li').first().locator('.why').count() >= 2, 'quiz: “why it matches” chips shown');

  // ask about this home → prefills the form
  const firstProject = (await page.locator('[data-rlist] .rcard__p').first().textContent()).split(' · ')[0];
  await page.locator('[data-rlist] [data-ask]').first().click();
  await page.waitForTimeout(700);
  ok(await page.inputValue('#interest') === firstProject && (await page.inputValue('#message')).includes('apartment'), 'ask: prefills #interest (' + firstProject + ') and #message');

  // projects
  ok(await page.locator('[data-pcard]').count() === 5, 'projects: 5 bento cards');
  await page.locator('#p-solivar [data-toggle]').click();
  ok(await page.locator('#p-solivar [data-toggle][aria-expanded="true"]').count() === 1 && await page.locator('#u-solivar .urow').count() === 7, 'projects: S’Olivar expands to 7 homes');
  ok((await page.locator('#u-solivar .urow__st').first().textContent()) === 'Sold', 'projects: sold homes flagged “Sold”');

  // services filter
  await page.locator('[data-group="Advise"]').click();
  ok(await page.locator('[data-sg]:not([hidden])').count() === 4 && await page.locator('[data-group="Advise"][aria-pressed="true"]').count() === 1, 'services: Advise chip shows 4');
  await page.locator('[data-group="all"]').click();
  ok(await page.locator('[data-sg]:not([hidden])').count() === 12, 'services: All shows 12');

  // stepper
  await page.locator('#st-2').click();
  ok(await page.locator('#sp-2:not([hidden]) h3').textContent() === 'Construction', 'stepper: step 3 shows Construction');
  await page.keyboard.press('ArrowRight');
  ok(await page.locator('#st-3[aria-selected="true"]').count() === 1 && await page.locator('#sp-3:not([hidden])').count() === 1, 'stepper: ArrowRight moves to step 4');

  // FAQ
  await page.locator('#faq-3-b').click();
  ok(await page.locator('#faq-3:not([hidden])').count() === 1 && await page.getAttribute('#faq-3-b', 'aria-expanded') === 'true', 'investment FAQ opens');

  // mobile menu
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + 'concept-j/', { waitUntil: 'networkidle' });
  await m.locator('[data-menu]').click(); await m.waitForTimeout(500);
  ok(await m.locator('[data-nav].is-open a').first().isVisible() && await m.getAttribute('[data-menu]', 'aria-expanded') === 'true', 'J mobile menu opens');
  await m.keyboard.press('Escape'); await m.waitForTimeout(400);
  ok(await m.getAttribute('[data-menu]', 'aria-expanded') === 'false', 'J mobile menu closes with Esc');
  const small = await m.$$eval('a, button', els => els.filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && s.visibility !== 'hidden' && r.height < 32 && !e.closest('.dc-sw'); }).map(e => e.textContent.trim().slice(0, 30)));
  ok(small.length === 0, 'J mobile: no interactive targets under 32px' + (small.length ? ' → ' + small.join(' | ') : ''));
  await m.close();

  await formTest(page, 'J');
};
