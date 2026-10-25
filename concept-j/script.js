/* Concept J — Hogar Match: bento hero, 3-step home-match quiz, expandable project bento, service filter, process stepper, FAQ */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;
  var reduce = T.reducedMotion();

  /* ---------- header / mobile menu ---------- */
  var top = $('[data-top]'), menu = $('[data-menu]'), nav = $('[data-nav]'), menuLabel = $('[data-menu-label]');
  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    menuLabel.textContent = open ? 'Close' : 'Menu';
  }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menu.focus(); }
  });
  document.addEventListener('click', function (e) { if (nav.classList.contains('is-open') && !e.target.closest('[data-top]')) setMenu(false); });
  window.addEventListener('scroll', function () { top.classList.toggle('is-scrolled', window.scrollY > 12); }, { passive: true });

  /* ---------- hero counts (computed from data) ---------- */
  var allUnits = [];
  T.projects.forEach(function (p) { p.units.forEach(function (u) { allUnits.push({ p: p, u: u }); }); });
  var nb = $('[data-count-buildings]'), nh = $('[data-count-homes]');
  nb.textContent = T.projects.length;
  nh.textContent = allUnits.length;
  if (!reduce && 'IntersectionObserver' in window) {
    var target = allUnits.length;
    var cio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      cio.disconnect();
      var t0 = null;
      (function tick(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - k, 3);
        nh.textContent = Math.round(target * e);
        if (k < 1) requestAnimationFrame(tick); else nh.textContent = target;
      })(performance.now());
    });
    cio.observe(nh);
  }

  /* ---------- helpers ---------- */
  function isSold(p) { return p.status === 'sold'; }
  function bedsLabel(n) { return n + ' bedroom' + (n === 1 ? '' : 's'); }
  function unitTitle(u) { return 'Apartment ' + u.n + (u.duplex ? ' · duplex' : ''); }
  var CHECK = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var NEAR = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M3 6.5c1.7-1.6 3.3-1.6 5 0s3.3 1.6 5 0M3 10.5c1.7-1.6 3.3-1.6 5 0s3.3 1.6 5 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  /* ---------- ask about a home → prefill form ---------- */
  function setInterest(v) {
    var sel = $('#interest');
    if (!$$('option', sel).some(function (o) { return o.value === v; })) {
      var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o);
    }
    sel.value = v;
  }
  function ask(pid, n) {
    var p = T.project(pid), u = p.units.filter(function (x) { return x.n === +n; })[0];
    var o = T.outdoor(u);
    var spec = bedsLabel(u.beds) + ', ' + T.fmtArea(u.area) + (o ? ', ' + o.label.toLowerCase() + ' ' + T.fmtArea(o.value) : '');
    if (isSold(p)) {
      setInterest('Homes similar to ' + p.name);
      $('#message').value = 'Hello! I liked apartment ' + u.n + ' at ' + p.name + ' (' + spec + '). I know it is sold — could you tell me about similar homes?';
    } else {
      setInterest(p.name);
      $('#message').value = 'Hello! I’m interested in apartment ' + u.n + ' at ' + p.name + ' (' + spec + '). Could you send me availability and the price?';
    }
    var w = $('#write');
    w.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () { $('#name').focus({ preventScroll: true }); }, reduce ? 0 : 500);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-ask]');
    if (a) { e.preventDefault(); ask(a.getAttribute('data-ask'), a.getAttribute('data-unit')); return; }
    var i = e.target.closest('[data-interest]');
    if (i) setInterest(i.getAttribute('data-interest'));
  });

  /* ---------- quiz ---------- */
  // Location fit per project, worded only from facts in data.js (summary, area, facts).
  var LOC = {
    'marina-residence': { sea: [3, '30 m from El Arenal beach'], city: [1, 'Palma, by the sea at El Arenal'] },
    'foners-club': { city: [3, 'Close to Palma’s historic centre'], sea: [1, '10-minute walk to the beach'] },
    'can-marques': { city: [3, 'Pere Garau, Palma'] },
    'boho-corner': { city: [3, 'El Terreno, Palma'], sea: [1, 'Steps from the Paseo Marítimo'] },
    'solivar': { soller: [3, 'Port de Sóller'], sea: [1, 'In a seaside port'] }
  };
  var WHERE = { city: 'in Palma city', sea: 'by the sea', soller: 'in Port de Sóller', any: 'anywhere' };
  var MUST = { pool: 'with a pool', outdoor: 'with a terrace or garden', parking: 'with parking', none: '' };

  function locFit(p, where) {
    if (where === 'any') return { s: 0, ok: true, chip: null };
    var l = (LOC[p.id] || {})[where];
    if (!l) return { s: 0, ok: false };
    return { s: l[0], ok: true, chip: { t: l[1], full: l[0] === 3 } };
  }
  function bedFit(u, beds) {
    var b = +beds, exact = b === 3 ? u.beds >= 3 : u.beds === b;
    if (exact) return { s: 3, exact: true, chip: { t: bedsLabel(u.beds), full: true } };
    var near = b === 3 ? u.beds === 2 : Math.abs(u.beds - b) === 1;
    return near ? { s: 1, exact: false, chip: { t: bedsLabel(u.beds) + ' (close)', full: false } } : null;
  }
  function mustFit(p, u, must) {
    var am = p.amenities.join(' | ');
    if (must === 'pool') {
      var m = am.match(/(Private pool|Pool)/);
      return m ? { s: 2, chip: { t: m[1] === 'Pool' ? 'Pool in the building' : 'Private pool', full: true } } : { s: 0 };
    }
    if (must === 'parking') {
      var k = am.match(/(Private parking|Parking)/);
      return k ? { s: 2, chip: { t: k[1], full: true } } : { s: 0 };
    }
    if (must === 'outdoor') {
      if (u.garden) return { s: 2, chip: { t: 'Garden ' + T.fmtArea(u.garden), full: true } };
      if (u.terrace) return { s: 2, chip: { t: 'Terrace ' + T.fmtArea(u.terrace), full: true } };
      if (u.balcony) return { s: 1, chip: { t: 'Balcony ' + T.fmtArea(u.balcony), full: false } };
      return { s: 0 };
    }
    return { s: 0 };
  }

  function match(ans) {
    var scored = allUnits.map(function (x) {
      var l = locFit(x.p, ans.where), b = bedFit(x.u, ans.beds), m = mustFit(x.p, x.u, ans.must);
      if (!b) return null;
      var chips = [];
      if (l.chip) chips.push(l.chip);
      chips.push(b.chip);
      if (m.chip) chips.push(m.chip);
      return { p: x.p, u: x.u, locOk: l.ok, exact: b.exact, score: l.s + b.s + m.s, chips: chips };
    }).filter(Boolean);
    var note = '';
    var exact = scored.filter(function (r) { return r.locOk && r.exact; });
    var res = exact.length >= 3 ? exact : scored.filter(function (r) { return r.locOk; });
    if (!res.length) {
      res = scored.filter(function (r) { return r.exact; });
      note = 'None of our published homes in ' + WHERE[ans.where].replace(/^in /, '') + ' has that number of bedrooms — here are the closest homes elsewhere on the island.';
    }
    res.sort(function (a, c) {
      var sa = isSold(a.p) ? 1 : 0, sc = isSold(c.p) ? 1 : 0;
      if (sa !== sc) return sa - sc;
      if (c.score !== a.score) return c.score - a.score;
      if (ans.must === 'outdoor') { var oa = T.outdoor(a.u), oc = T.outdoor(c.u); var d = (oc ? oc.value : 0) - (oa ? oa.value : 0); if (d) return d; }
      return c.u.area - a.u.area;
    });
    return { list: res, note: note };
  }

  var quiz = $('[data-quiz]'), steps = $$('[data-step]', quiz), back = $('[data-back]'), next = $('[data-next]');
  var hint = $('[data-hint]'), live = $('[data-quiz-live]'), results = $('[data-results]');
  var progress = $$('[data-progress] li'), bar = $('[data-progress-bar]');
  var NAMES = ['where', 'beds', 'must'], card = $('.match__card');
  var cur = 0, shown = 6, last = null;

  function val(name) { var c = $('input[name="' + name + '"]:checked', quiz); return c ? c.value : null; }
  function setProgress(i) {
    progress.forEach(function (li, k) {
      li.classList.toggle('is-done', k < i);
      if (k === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    bar.style.width = (Math.min(i, 3) / 3 * 100) + '%';
  }
  function go(i, focus) {
    cur = i;
    steps.forEach(function (s, k) { s.hidden = k !== i; });
    var s = steps[i];
    s.classList.remove('is-in'); void s.offsetWidth; s.classList.add('is-in');
    back.hidden = i === 0;
    next.innerHTML = i === 2 ? 'Show my matches <span class="btn__arr" aria-hidden="true">→</span>' : 'Next <span class="btn__arr" aria-hidden="true">→</span>';
    hint.hidden = true;
    setProgress(i);
    if (focus) {
      var chosen = $('input:checked', s) || $('input', s);
      chosen.focus({ preventScroll: true });
      live.textContent = s.querySelector('legend').textContent.replace(/\s+/g, ' ').trim();
    }
  }
  quiz.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!val(NAMES[cur])) {
      hint.hidden = false;
      hint.classList.remove('is-shake'); void hint.offsetWidth; hint.classList.add('is-shake');
      live.textContent = 'Pick one answer to continue.';
      ($('input', steps[cur])).focus({ preventScroll: true });
      return;
    }
    if (cur < 2) go(cur + 1, true); else showResults();
  });
  back.addEventListener('click', function () { if (cur > 0) go(cur - 1, true); });
  // Choosing an answer with a click (not with arrow keys) gives a little nudge to "Next"
  quiz.addEventListener('change', function () { hint.hidden = true; next.classList.remove('is-nudge'); void next.offsetWidth; next.classList.add('is-nudge'); });

  function chipHTML(c) { return '<li class="why' + (c.full ? '' : ' why--near') + '">' + (c.full ? CHECK : NEAR) + esc(c.t) + '</li>'; }
  function resultHTML(r, i) {
    var p = r.p, u = r.u, sold = isSold(p), o = T.outdoor(u);
    return '<li class="rcard' + (sold ? ' rcard--sold' : '') + '" style="--i:' + i + '">' +
      '<img class="rcard__img" src="' + T.img(p.card) + '" alt="" width="1000" height="635" loading="lazy">' +
      '<div class="rcard__body">' +
        '<p class="rcard__p">' + esc(p.name) + ' · ' + esc(p.area) + '</p>' +
        '<h4 class="rcard__t">' + unitTitle(u) + '</h4>' +
        '<p class="rcard__spec">' + T.fmtArea(u.area) + ' · ' + bedsLabel(u.beds) + ' · ' + u.baths + ' bath' + (u.baths === 1 ? '' : 's') + (o ? ' · ' + o.label.toLowerCase() + ' ' + T.fmtArea(o.value) : '') + '</p>' +
        '<ul class="whys" aria-label="Why it matches">' + r.chips.map(chipHTML).join('') + '</ul>' +
      '</div>' +
      '<div class="rcard__side">' +
        (sold ? '<span class="pill pill--sold">Sold — ask about similar homes</span>'
              : '<span class="pill pill--open">In progress · Price on request</span>') +
        '<button type="button" class="btn btn--navy btn--sm" data-ask="' + p.id + '" data-unit="' + u.n + '">' + (sold ? 'Ask about similar homes' : 'Ask about this home') + '<span class="sr-only"> — ' + esc(p.name) + ', apartment ' + u.n + '</span></button>' +
      '</div></li>';
  }
  function renderResults() {
    var list = last.list, rl = $('[data-rlist]');
    rl.innerHTML = list.slice(0, shown).map(resultHTML).join('');
    var more = $('[data-more]');
    more.hidden = list.length <= shown;
    more.textContent = 'Show all ' + list.length + ' matches';
  }
  function showResults() {
    var ans = { where: val('where'), beds: val('beds'), must: val('must') };
    last = match(ans); shown = 6;
    quiz.hidden = true; results.hidden = false; card.classList.add('is-results');
    setProgress(3);
    var bedsT = ans.beds === '3' ? '3+ bedrooms' : bedsLabel(+ans.beds);
    $('[data-results-sum]').textContent = 'Homes ' + WHERE[ans.where] + ' · ' + bedsT + (MUST[ans.must] ? ' · ' + MUST[ans.must] : '');
    var note = $('[data-results-note]');
    note.hidden = !last.note; note.textContent = last.note;
    renderResults();
    var open = last.list.filter(function (r) { return !isSold(r.p); }).length;
    var h = $('[data-results-h]');
    h.textContent = last.list.length + ' home' + (last.list.length === 1 ? '' : 's') + ' match' + (last.list.length === 1 ? 'es' : '');
    live.textContent = h.textContent + '. ' + open + ' in buildings in progress, ' + (last.list.length - open) + ' already sold. ' +
      (last.list[0] ? 'Top match: apartment ' + last.list[0].u.n + ' at ' + last.list[0].p.name + '.' : '');
    h.focus({ preventScroll: true });
    var mt = $('#match').getBoundingClientRect().top;
    if (mt < -40 || mt > window.innerHeight * 0.4) $('#match').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  $('[data-more]').addEventListener('click', function () {
    var first = shown; shown = last.list.length; renderResults();
    var b = $$('[data-rlist] [data-ask]')[first]; if (b) b.focus();
  });
  $('[data-restart]').addEventListener('click', function () {
    results.hidden = true; quiz.hidden = false; card.classList.remove('is-results'); go(0, true);
  });
  $$('[data-start]').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(function () { if (!quiz.hidden) ($('input:checked', steps[cur]) || $('input', steps[cur])).focus({ preventScroll: true }); }, reduce ? 0 : 600); });
  });
  go(0, false);

  /* ---------- projects bento ---------- */
  var ORDER = ['marina-residence', 'foners-club', 'can-marques', 'solivar', 'boho-corner'];
  $('[data-pgrid]').innerHTML = ORDER.map(function (id, i) {
    var p = T.project(id), sold = isSold(p);
    var units = p.units.map(function (u) {
      var o = T.outdoor(u);
      return '<li class="urow">' +
        '<span class="urow__n">' + u.n + '</span>' +
        '<span class="urow__spec"><b>' + T.fmtArea(u.area) + '</b> · ' + bedsLabel(u.beds) + ' · ' + u.baths + ' bath' + (u.baths === 1 ? '' : 's') + (o ? ' · ' + o.label.toLowerCase() + ' ' + T.fmtArea(o.value) : '') + (u.duplex ? ' · duplex' : '') + '</span>' +
        '<span class="urow__st">' + (sold ? 'Sold' : 'Price on request') + '</span>' +
        '<button type="button" class="ask" data-ask="' + p.id + '" data-unit="' + u.n + '">Ask<span class="sr-only"> about apartment ' + u.n + ', ' + esc(p.name) + '</span></button>' +
      '</li>';
    }).join('');
    return '<article class="pcard pcard--' + (i + 1) + (sold ? ' pcard--sold' : '') + '" id="p-' + p.id + '" data-pcard>' +
      '<div class="pcard__media"><img src="' + T.img(p.gallery[0]) + '" alt="' + esc(p.name) + ', ' + esc(p.area) + ' — ' + esc(p.headline.toLowerCase()) + '" width="1920" height="1080" loading="lazy">' +
        '<span class="pill ' + (sold ? 'pill--sold' : 'pill--open') + '">' + (sold ? 'Completed · Sold' : 'In progress') + '</span></div>' +
      '<div class="pcard__body">' +
        '<p class="pcard__loc">' + esc(p.area) + ' · ' + esc(p.city) + '</p>' +
        '<h3 class="pcard__t">' + esc(p.name) + '</h3>' +
        '<p class="pcard__h"><em>' + esc(p.headline) + '</em></p>' +
        '<p class="pcard__s">' + esc(p.summary) + '</p>' +
        '<ul class="facts">' + p.facts.filter(function (f) { return f[0] !== 'Status'; }).map(function (f) { return f[1] === 'Yes' ? '<li><b>' + esc(f[0]) + '</b></li>' : '<li><b>' + esc(f[1]) + '</b> ' + esc(f[0].toLowerCase()) + '</li>'; }).join('') + '</ul>' +
        '<ul class="amen" aria-label="Amenities">' + p.amenities.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
        '<button type="button" class="btn btn--soft pcard__toggle" aria-expanded="false" aria-controls="u-' + p.id + '" data-toggle>' +
          '<span data-toggle-l>See the ' + p.units.length + ' homes</span><span class="plus" aria-hidden="true"></span></button>' +
      '</div>' +
      '<div class="pcard__units" id="u-' + p.id + '" hidden>' +
        '<p class="pcard__uh">' + p.units.length + ' homes at ' + esc(p.name) + (sold ? ' — all sold. Ask us about similar homes.' : ' — prices on request.') + '</p>' +
        '<ul class="ulist">' + units + '</ul>' +
      '</div>' +
    '</article>';
  }).join('');
  $('[data-pgrid]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-toggle]'); if (!b) return;
    var card = b.closest('[data-pcard]'), open = b.getAttribute('aria-expanded') !== 'true';
    var p = T.project(card.id.slice(2));
    b.setAttribute('aria-expanded', String(open));
    $('#u-' + p.id).hidden = !open;
    card.classList.toggle('is-open', open);
    $('[data-toggle-l]', b).textContent = open ? 'Hide the homes' : 'See the ' + p.units.length + ' homes';
    if (open && !reduce) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* ---------- services filter ---------- */
  var SINT = { custom: 'Custom construction', sales: 'Selling my property', evaluation: 'Selling my property', consult: 'Investment consultation', finance: 'Investment consultation' };
  var GCLS = { 'Build': 'peach', 'Buy & sell': 'sky', 'Advise': 'mint' };
  $('[data-sgrid]').innerHTML = T.services.map(function (s) {
    return '<li class="scard scard--' + GCLS[s.group] + '" data-sg="' + esc(s.group) + '">' +
      '<span class="scard__ic" style="--ic:url(../images/icons/' + s.icon + ')" aria-hidden="true"></span>' +
      '<p class="scard__g">' + esc(s.group) + '</p>' +
      '<h3>' + esc(s.title) + '</h3><p class="scard__p">' + esc(s.text) + '</p>' +
      '<a class="scard__a" href="#write" data-interest="' + (SINT[s.id] || 'General enquiry') + '">Ask about this<span class="sr-only">: ' + esc(s.title) + '</span> <span aria-hidden="true">→</span></a>' +
    '</li>';
  }).join('');
  $$('[data-n]').forEach(function (n) {
    var g = n.getAttribute('data-n');
    n.textContent = g === 'all' ? T.services.length : T.services.filter(function (s) { return s.group === g; }).length;
  });
  $('[data-sfilter]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-group]'); if (!b) return;
    var g = b.getAttribute('data-group');
    $$('[data-group]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    var n = 0;
    $$('[data-sg]').forEach(function (c, i) {
      var show = g === 'all' || c.getAttribute('data-sg') === g;
      c.hidden = !show;
      if (show) { c.style.setProperty('--i', n++); c.classList.remove('is-pop'); void c.offsetWidth; c.classList.add('is-pop'); }
    });
    $('[data-slive]').textContent = 'Showing ' + n + ' service' + (n === 1 ? '' : 's') + (g === 'all' ? '' : ' in ' + g);
  });

  /* ---------- process stepper (tabs) ---------- */
  var tabs = $('[data-tabs]'), panels = $('[data-panels]');
  tabs.innerHTML = T.process.map(function (s, i) {
    return '<button type="button" role="tab" id="st-' + i + '" aria-controls="sp-' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
      '<span class="stepper__n">' + (i + 1) + '</span><span class="stepper__l">' + esc(s.step) + '</span></button>';
  }).join('');
  panels.innerHTML = T.process.map(function (s, i) {
    return '<div class="stepper__panel" role="tabpanel" id="sp-' + i + '" aria-labelledby="st-' + i + '" tabindex="0"' + (i ? ' hidden' : '') + '>' +
      '<p class="stepper__k">Step ' + (i + 1) + ' of ' + T.process.length + '</p>' +
      '<h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p>' +
      '<div class="stepper__nav">' +
        (i > 0 ? '<button type="button" class="btn btn--ghost btn--sm" data-go="' + (i - 1) + '"><span aria-hidden="true">←</span> ' + esc(T.process[i - 1].step) + '</button>' : '') +
        (i < T.process.length - 1 ? '<button type="button" class="btn btn--navy btn--sm" data-go="' + (i + 1) + '">Next: ' + esc(T.process[i + 1].step) + ' <span aria-hidden="true">→</span></button>'
          : '<a class="btn btn--navy btn--sm" href="#write">Start with a conversation <span aria-hidden="true">→</span></a>') +
      '</div></div>';
  }).join('');
  var tabBtns = $$('[role="tab"]', tabs);
  function selectStep(i, focus) {
    tabBtns.forEach(function (b, k) {
      b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1;
      b.classList.toggle('is-done', k < i);
      $('#sp-' + k).hidden = k !== i;
    });
    tabs.style.setProperty('--done', i / (tabBtns.length - 1));
    var pnl = $('#sp-' + i); pnl.classList.remove('is-in'); void pnl.offsetWidth; pnl.classList.add('is-in');
    if (focus) tabBtns[i].focus();
  }
  tabs.addEventListener('click', function (e) { var b = e.target.closest('[role="tab"]'); if (b) selectStep(tabBtns.indexOf(b)); });
  tabs.addEventListener('keydown', function (e) {
    var i = tabBtns.indexOf(document.activeElement); if (i < 0) return;
    var n = tabBtns.length, j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + n) % n;
    else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1;
    if (j !== null) { e.preventDefault(); selectStep(j, true); }
  });
  panels.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) selectStep(+b.getAttribute('data-go'), true); });
  selectStep(0);

  /* ---------- FAQ accordion ---------- */
  $('[data-faq]').addEventListener('click', function (e) {
    var b = e.target.closest('button[aria-controls]'); if (!b) return;
    var open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    $('#' + b.getAttribute('aria-controls')).hidden = !open;
    b.closest('.faq__item').classList.toggle('is-open', open);
  });

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec-h, .match__card, .pcard, .scard, .stepper, .invest__intro, .faq__item, .form, .ctile').forEach(function (el, i) { el.classList.add('rv'); io.observe(el); });
  }
  $('[data-year]').textContent = new Date().getFullYear();
})();
