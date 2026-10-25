/* Concept K — Postal: travel-poster project cards, postcard-back dialog, stamp route, ticket filter, interest prefill */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;

  /* ---------- header & mobile menu ---------- */
  var hdr = $('[data-hdr]'), menu = $('[data-menu]'), nav = $('[data-nav]'), menuLabel = $('[data-menu-label]');
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
  window.addEventListener('scroll', function () { hdr.classList.toggle('is-scrolled', window.scrollY > 8); }, { passive: true });

  /* ---------- stats (computed from data, never typed in) ---------- */
  var homes = T.projects.reduce(function (n, p) { return n + p.units.length; }, 0);
  $('[data-stat="projects"]').textContent = T.projects.length;
  $('[data-stat="homes"]').textContent = homes;
  $('[data-stat="open"]').textContent = T.projects.filter(function (p) { return p.status !== 'sold'; }).length;

  /* ---------- pillars ---------- */
  $('[data-pillars]').innerHTML = T.company.pillars.map(function (p) {
    return '<li><h2>' + esc(p.title) + '</h2><p>' + esc(p.text) + '</p></li>';
  }).join('');

  /* ---------- poster cards ---------- */
  // each poster gets its own duotone ink pair: dark (shadows) / light (paper)
  var INKS = {
    'marina-residence': { dk: '#184680', lt: '#F3B33D', sun: '#F7EEDC' },
    'foners-club':      { dk: '#1B1A2E', lt: '#E9876A', sun: '#F3B33D' },
    'can-marques':      { dk: '#0E5652', lt: '#F2D7A6', sun: '#D8553A' },
    'solivar':          { dk: '#3D5326', lt: '#F1D486', sun: '#F7EEDC' },
    'boho-corner':      { dk: '#8E2E1C', lt: '#F4C9A6', sun: '#1C4E8A' }
  };
  var ORDER = ['marina-residence', 'foners-club', 'can-marques', 'solivar', 'boho-corner'];
  var list = ORDER.map(T.project);
  function inks(p) { var k = INKS[p.id]; return '--dk:' + k.dk + ';--lt:' + k.lt + ';--sunc:' + k.sun; }
  function two(n) { return (n < 10 ? '0' : '') + n; }

  $('[data-posters]').innerHTML = list.map(function (p, i) {
    var sold = p.status === 'sold';
    return '<li class="pcard' + (sold ? ' is-sold' : '') + '" style="' + inks(p) + '">' +
      '<article class="pcard__in" aria-labelledby="pc-' + p.id + '">' +
        '<div class="pcard__art duo"><img src="' + T.img(p.hero) + '" alt="' + esc(p.name) + ', ' + esc(p.area) + ': exterior view" width="1920" height="1080" loading="lazy"></div>' +
        '<svg class="pcard__wave" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"><use href="#wave-path"/></svg>' +
        '<div class="pcard__txt">' +
          '<span class="pcard__disc" aria-hidden="true"><small>No.</small>' + two(i + 1) + '</span>' +
          '<p class="pcard__status">' + (sold ? 'Completed · Sold' : 'In progress') + '</p>' +
          '<h3 class="pcard__name" id="pc-' + p.id + '">' + esc(p.name) + '</h3>' +
          '<p class="pcard__place">' + esc(p.area) + '</p>' +
          '<p class="pcard__meta">' + p.units.length + ' homes · ' + esc(p.headline) + '</p>' +
          '<button class="pcard__flip" type="button" data-open="' + p.id + '" aria-haspopup="dialog">Turn over <span class="sr">— homes and facts of ' + esc(p.name) + '</span><span aria-hidden="true">↻</span></button>' +
        '</div>' +
      '</article></li>';
  }).join('');

  /* ---------- postcard back (dialog) ---------- */
  var dlg = $('[data-pc]'), card = $('[data-pc-card]'), cur = 0, opener = null;
  var canModal = dlg && typeof dlg.showModal === 'function';

  function outdoorTxt(u) { var o = T.outdoor(u); return o ? o.label + ' ' + T.fmtArea(o.value) : '—'; }
  function fill(i) {
    cur = (i + list.length) % list.length;
    var p = list[cur], sold = p.status === 'sold';
    dlg.setAttribute('style', inks(p));
    var img = $('[data-pc-img]');
    img.src = T.img(p.gallery[1] || p.hero);
    img.alt = p.name + ', ' + p.area + ': view of the building';
    $('[data-pc-area]').textContent = p.area;
    $('[data-pc-name]').textContent = p.name;
    $('[data-pc-head]').textContent = p.headline + '.';
    $('[data-pc-head-es]').textContent = p.headlineEs;
    $('[data-pc-sum]').textContent = p.summary;
    $('[data-pc-facts]').innerHTML = p.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
    $('[data-pc-amen]').innerHTML = p.amenities.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
    $('[data-pc-no]').textContent = 'No. ' + two(cur + 1);
    $('[data-pc-status]').textContent = sold ? '— all sold' : '— price on request';
    $('[data-pc-units]').innerHTML = p.units.map(function (u) {
      return '<li class="unit">' +
        '<span class="unit__n">Apt ' + u.n + (u.duplex ? ' <em>duplex</em>' : '') + '</span>' +
        '<span class="unit__spec"><b>' + T.fmtArea(u.area) + '</b> · ' + u.beds + ' bed · ' + u.baths + ' bath' + (T.outdoor(u) ? ' · <span class="unit__o">' + outdoorTxt(u).toLowerCase() + '</span>' : '') + '</span>' +
        (sold ? '<span class="unit__p is-sold">Sold</span>'
              : '<span class="unit__p">Price on request</span><button type="button" class="unit__ask" data-ask-unit="' + u.n + '" aria-label="Ask about apartment ' + u.n + ', ' + esc(p.name) + '">Ask</button>') +
        '</li>';
    }).join('');
    var ask = $('[data-pc-ask]');
    ask.textContent = sold ? 'Ask about similar homes' : 'Ask about this home';
    $('[data-pc-prev]').textContent = list[(cur - 1 + list.length) % list.length].name;
    $('[data-pc-next]').textContent = list[(cur + 1) % list.length].name;
  }
  function flip() {
    if (T.reducedMotion()) return;
    card.classList.remove('is-flipping'); void card.offsetWidth; card.classList.add('is-flipping');
  }
  function openCard(id, from) {
    opener = from || null;
    fill(ORDER.indexOf(id));
    if (canModal) dlg.showModal(); else dlg.setAttribute('open', '');
    flip();
    dlg.scrollTop = 0; card.scrollTop = 0;
  }
  function closeCard() {
    if (canModal) { if (dlg.open) dlg.close(); } else dlg.removeAttribute('open');
  }
  dlg.addEventListener('close', function () { if (opener && document.contains(opener)) opener.focus(); });
  $('[data-posters]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]'); if (b) openCard(b.getAttribute('data-open'), b);
  });
  $('[data-pc-close]').addEventListener('click', closeCard);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeCard(); });
  $$('[data-pc-step]').forEach(function (b) {
    b.addEventListener('click', function () {
      fill(cur + Number(b.getAttribute('data-pc-step')));
      flip();
      card.scrollTop = 0;
      opener = $('[data-open="' + list[cur].id + '"]');
    });
  });
  dlg.addEventListener('keydown', function (e) {
    if (e.target.closest('select, input, textarea')) return;
    if (e.key === 'ArrowRight') { $('[data-pc-step="1"]').click(); }
    if (e.key === 'ArrowLeft') { $('[data-pc-step="-1"]').click(); }
  });

  function prefill(interest, message) {
    var sel = $('#interest');
    if (!$$('option', sel).some(function (o) { return o.value === interest; })) {
      var o = document.createElement('option'); o.value = o.textContent = interest; sel.appendChild(o);
    }
    sel.value = interest;
    if (message != null) $('#message').value = message;
  }
  function goWrite() {
    opener = null;
    closeCard();
    var w = $('#write');
    w.scrollIntoView({ behavior: T.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () { $('#name').focus({ preventScroll: true }); }, T.reducedMotion() ? 0 : 450);
  }
  $('[data-pc-ask]').addEventListener('click', function () {
    var p = list[cur], sold = p.status === 'sold';
    prefill(sold ? 'Homes similar to ' + p.name : p.name,
      sold ? 'Hello, ' + p.name + ' is sold — I would like to hear about similar homes you are building.'
           : 'Hello, I would like to know more about the homes in ' + p.name + ' (' + p.area + ').');
    goWrite();
  });
  $('[data-pc-units]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-ask-unit]'); if (!b) return;
    var p = list[cur];
    prefill(p.name, 'Hello, I would like to know more about apartment ' + b.getAttribute('data-ask-unit') + ' in ' + p.name + ' (' + p.area + ').');
    goWrite();
  });

  /* ---------- route: four stamps ---------- */
  var ICONS = [
    // plot: sun over a field
    '<circle cx="40" cy="30" r="14"/><path d="M4 70 Q40 46 76 70 Z"/><path d="M4 76h72" class="ln"/>',
    // design: set square and arc
    '<path d="M10 70 L10 14 L66 70 Z" class="ln"/><path d="M10 50 L30 70" class="ln"/><path d="M20 22 A40 40 0 0 1 64 58" class="ln"/>',
    // build: stacked blocks
    '<rect x="8" y="50" width="28" height="22"/><rect x="40" y="50" width="28" height="22"/><rect x="24" y="26" width="28" height="22"/><path d="M38 6 v14" class="ln"/>',
    // keys
    '<circle cx="24" cy="40" r="14" class="ln"/><circle cx="24" cy="40" r="5"/><path d="M38 40 H74 M62 40 v10 M70 40 v8" class="ln"/>'
  ];
  $('[data-stamps]').innerHTML = T.process.map(function (s, i) {
    return '<li class="stamp stamp--' + (i + 1) + '">' +
      '<div class="stamp__wrap" aria-hidden="true"><div class="stamp__face">' +
        '<span class="stamp__val">' + two(i + 1) + '</span>' +
        '<svg class="stamp__ic" viewBox="0 0 80 80" focusable="false">' + ICONS[i] + '</svg>' +
        '<span class="stamp__word">' + esc(s.step) + '</span>' +
        '<span class="stamp__country">Mallorca · TID</span></div>' +
        '<svg class="stamp__pm" viewBox="0 0 120 40" preserveAspectRatio="none" focusable="false"><path d="M0 8 Q15 0 30 8 T60 8 T90 8 T120 8 M0 20 Q15 12 30 20 T60 20 T90 20 T120 20 M0 32 Q15 24 30 32 T60 32 T90 32 T120 32" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>' +
      '</div>' +
      '<h3 class="stamp__h"><span class="sr">Stop ' + (i + 1) + ', ' + esc(s.step) + ': </span>' + esc(s.title) + '</h3>' +
      '<p class="stamp__p">' + esc(s.text) + '</p>' +
      '</li>';
  }).join('');

  /* ---------- services: tickets with a filter ---------- */
  var CODE = { 'Build': 'BLD', 'Buy & sell': 'B&S', 'Advise': 'ADV' };
  var tickets = $('[data-tickets]');
  tickets.innerHTML = T.services.map(function (s, i) {
    return '<li class="tkt tkt--' + CODE[s.group].replace('&', '') + '" data-group="' + esc(s.group) + '"><div class="tkt__in">' +
      '<div class="tkt__stub" aria-hidden="true"><span class="tkt__code">' + esc(CODE[s.group]) + '</span><span class="tkt__no">No. ' + two(i + 1) + '</span></div>' +
      '<div class="tkt__body"><p class="tkt__grp">' + esc(s.group) + '</p><h3 class="tkt__h">' + esc(s.title) + '</h3><p class="tkt__p">' + esc(s.text) + '</p></div>' +
      '</div></li>';
  }).join('');
  $$('[data-count]').forEach(function (c) {
    var g = c.getAttribute('data-count');
    c.textContent = '(' + T.services.filter(function (s) { return g === 'all' || s.group === g; }).length + ')';
  });
  $('[data-filters]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]'); if (!b) return;
    var g = b.getAttribute('data-filter');
    $$('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    $$('.tkt', tickets).forEach(function (t, i) {
      var show = g === 'all' || t.getAttribute('data-group') === g;
      t.hidden = !show;
      t.classList.remove('is-in');
      if (show && !T.reducedMotion()) { t.style.animationDelay = (i % 6) * 40 + 'ms'; void t.offsetWidth; t.classList.add('is-in'); }
    });
  });

  /* ---------- interest prefill from any [data-interest] ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (!a) return;
    prefill(a.getAttribute('data-interest'));
  });

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !T.reducedMotion()) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-vis'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sh, .pcard, .stamp, .invest__panel, .card').forEach(function (el, i) { el.classList.add('rv'); io.observe(el); });
  }

  $('[data-year]').textContent = new Date().getFullYear();
})();
