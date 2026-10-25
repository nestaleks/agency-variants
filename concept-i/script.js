/* Concept I — Carta Náutica: interactive project chart (island + Palma inset), gazetteer, legend card,
   status filters, dotted process route, legend-style services. All content from shared/data.js. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;
  var reduced = T.reducedMotion();

  /* ---------- header & mobile menu ---------- */
  var bar = $('[data-bar]'), menu = $('[data-menu]'), nav = $('[data-nav]'), menuLabel = $('[data-menu-label]');
  window.addEventListener('scroll', function () { bar.classList.toggle('is-scrolled', window.scrollY > 8); }, { passive: true });
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

  /* ---------- hero log (counts from data) ---------- */
  $('[data-count-projects]').textContent = T.projects.length;
  $('[data-count-units]').textContent = T.projects.reduce(function (s, p) { return s + p.units.length; }, 0);

  /* ---------- chart positions (viewBox units; stylised, approximate) ---------- */
  // island viewBox 0 0 1000 800 · inset viewBox 240 400 180 150
  var POS = {
    'solivar': { map: 'island', x: 344, y: 230, side: 'r' },
    'boho-corner': { map: 'inset', x: 283, y: 447, side: 't' },
    'can-marques': { map: 'inset', x: 318, y: 433, side: 'r' },
    'foners-club': { map: 'inset', x: 331, y: 456, side: 'r' },
    'marina-residence': { map: 'inset', x: 386, y: 499, side: 'l' }
  };
  var VB = { island: [0, 0, 1000, 800], inset: [222, 392, 210, 175] };
  var COORD = {
    Palma: 'Palma ≈ 39.57° N 2.65° E · approx.',
    'Sóller': 'Port de Sóller ≈ 39.80° N 2.69° E · approx.'
  };

  var projects = T.projects;
  var current = null, filter = 'all';

  function no(i) { return String(i + 1).padStart(2, '0'); }
  function statusText(p) { return p.status === 'sold' ? 'Completed · Sold' : 'In progress'; }

  /* pins */
  projects.forEach(function (p, i) {
    var pos = POS[p.id], vb = VB[pos.map];
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pin pin--' + pos.side + (p.status === 'sold' ? ' pin--sold' : '');
    b.setAttribute('data-pin', p.id);
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', p.name + ', ' + p.area + ' — ' + statusText(p));
    b.innerHTML = '<span class="pin__m" aria-hidden="true">' + (i + 1) + '</span><span class="pin__l" aria-hidden="true">' + esc(p.name) + '</span>';
    $('[data-pins="' + pos.map + '"]').appendChild(b);
  });

  // the Palma chart zooms in further on narrow screens so the four city pins never collide
  var insetSvg = $('[data-pinmap="inset"] svg'), insetWide = VB.inset.slice(), insetNarrow = [252, 412, 150, 125];
  function layoutPins() {
    VB.inset = $('[data-pinmap="inset"]').getBoundingClientRect().width < 520 ? insetNarrow : insetWide;
    insetSvg.setAttribute('viewBox', VB.inset.join(' '));
    var box = $('.inset-box');
    ['x', 'y', 'width', 'height'].forEach(function (k, i) { box.setAttribute(k, VB.inset[i]); });
    projects.forEach(function (p) {
      var pos = POS[p.id], vb = VB[pos.map], b = $('[data-pin="' + p.id + '"]');
      b.style.left = ((pos.x - vb[0]) / vb[2] * 100).toFixed(2) + '%';
      b.style.top = ((pos.y - vb[1]) / vb[3] * 100).toFixed(2) + '%';
    });
  }
  layoutPins();
  window.addEventListener('resize', layoutPins);

  /* gazetteer */
  $('[data-gaz]').innerHTML = projects.map(function (p, i) {
    return '<li data-gaz-item="' + p.id + '"><button type="button" class="gaz__b" aria-pressed="false" data-select="' + p.id + '">' +
      '<span class="gaz__n" aria-hidden="true">' + no(i) + '</span>' +
      '<span class="gaz__name">' + esc(p.name) + '</span>' +
      '<span class="gaz__area">' + esc(p.area) + (p.city !== 'Palma' ? '' : ' · Palma') + '</span>' +
      '<span class="gaz__st gaz__st--' + p.status + '">' + (p.status === 'sold' ? 'Sold' : 'In progress') + '</span>' +
      '</button></li>';
  }).join('');

  /* filter counts */
  ['all', 'in-progress', 'sold'].forEach(function (k) {
    $('[data-n="' + k + '"]').textContent = projects.filter(function (p) { return k === 'all' || p.status === k; }).length;
  });

  function visible(p) { return filter === 'all' || p.status === filter; }

  function select(id, opts) {
    opts = opts || {};
    var p = T.project(id), i = projects.indexOf(p);
    current = p;
    $$('[data-pin]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pin') === id)); });
    $$('[data-select]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-select') === id)); });

    var card = $('[data-card]');
    card.classList.remove('is-in'); void card.offsetWidth; card.classList.add('is-in');
    $('[data-c-no]').textContent = '· No. ' + no(i);
    var img = $('[data-c-img]');
    img.src = T.img(p.gallery[0]);
    img.alt = p.name + ', ' + p.area + ' — exterior visualisation of the building';
    $('[data-c-coord]').textContent = COORD[p.city] || '';
    var st = $('[data-c-status]');
    st.textContent = statusText(p);
    st.className = 'legend-card__status legend-card__status--' + p.status;
    $('[data-c-name]').textContent = p.name;
    $('[data-c-place]').textContent = p.area + ' — ' + (p.city === 'Sóller' ? 'Port de Sóller' : 'Palma de Mallorca');
    $('[data-c-text]').textContent = p.summary;
    $('[data-c-facts]').innerHTML = p.facts.filter(function (f) { return f[0] !== 'Status'; })
      .map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('');
    $('[data-c-amen]').innerHTML = p.amenities.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
    $('[data-c-caption]').textContent = p.units.length + ' homes at ' + p.name + (p.status === 'sold' ? ' — all sold' : ' — prices on request');
    $('[data-c-units]').innerHTML = p.units.map(function (u) {
      var o = T.outdoor(u);
      return '<tr><th scope="row">' + u.n + (u.duplex ? ' <span class="dup">duplex</span>' : '') + '</th>' +
        '<td>' + T.fmtArea(u.area) + '</td><td>' + u.beds + '</td><td>' + u.baths + '</td>' +
        '<td>' + (o ? o.label + ' ' + T.fmtArea(o.value) : '—') + '</td>' +
        '<td class="' + (p.status === 'sold' ? 'is-sold' : '') + '">' + (p.status === 'sold' ? 'Sold' : 'Price on request') + '</td></tr>';
    }).join('');
    var cta = $('[data-c-cta]');
    cta.textContent = p.status === 'sold' ? 'Ask about homes like ' + p.name : 'Enquire about ' + p.name;
    cta.setAttribute('data-interest', p.status === 'sold' ? 'Homes similar to ' + p.name : p.name);
    var page = $('[data-c-page]');
    page.href = p.page;
    page.textContent = 'Full project page — ' + p.name;

    if (opts.reveal) $('[data-c-live]').textContent = 'Legend shows ' + p.name + ', ' + p.area + '. ' + statusText(p) + '. ' + p.units.length + ' homes.';
    if (opts.reveal && window.matchMedia('(max-width: 1023px)').matches) {
      card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function applyFilter(f) {
    filter = f;
    $$('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === f)); });
    projects.forEach(function (p) {
      var v = visible(p);
      $('[data-pin="' + p.id + '"]').hidden = !v;
      $('[data-gaz-item="' + p.id + '"]').hidden = !v;
    });
    $$('.sheet--inset').forEach(function (s) {
      s.classList.toggle('is-quiet', !projects.some(function (p) { return visible(p) && POS[p.id].map === 'inset'; }));
    });
    if (!current || !visible(current)) select(projects.filter(visible)[0].id);
  }

  document.addEventListener('click', function (e) {
    var pin = e.target.closest('[data-pin]');
    if (pin) { select(pin.getAttribute('data-pin'), { reveal: true }); return; }
    var g = e.target.closest('[data-select]');
    if (g) { select(g.getAttribute('data-select'), { reveal: true }); return; }
    var f = e.target.closest('[data-filter]');
    if (f) applyFilter(f.getAttribute('data-filter'));
  });

  // hover/focus on a gazetteer row highlights its pin on the chart
  $('[data-gaz]').addEventListener('mouseover', function (e) { hl(e.target.closest('[data-select]')); });
  $('[data-gaz]').addEventListener('mouseout', function () { hl(null); });
  $('[data-gaz]').addEventListener('focusin', function (e) { hl(e.target.closest('[data-select]')); });
  $('[data-gaz]').addEventListener('focusout', function () { hl(null); });
  function hl(b) {
    var id = b && b.getAttribute('data-select');
    $$('[data-pin]').forEach(function (p) { p.classList.toggle('is-hl', p.getAttribute('data-pin') === id); });
  }

  select(projects[0].id);

  /* ---------- route (process) ---------- */
  $('[data-route]').innerHTML = T.process.map(function (s, i) {
    return '<li class="wp wp--' + (i % 2 ? 'lo' : 'hi') + '"><span class="wp__mark" aria-hidden="true"></span>' +
      '<p class="wp__n">Waypoint ' + no(i) + ' · ' + esc(s.step) + '</p>' +
      '<h3 class="wp__h">' + esc(s.title) + '</h3><p class="wp__p">' + esc(s.text) + '</p></li>';
  }).join('');

  // dotted course line threaded through the waypoint marks (desktop layout only)
  var wrap = $('.route__wrap'), svg = $('.route__line'), rpath = $('[data-route-path]');
  function drawRoute() {
    var box = wrap.getBoundingClientRect();
    var marks = $$('.wp__mark', wrap).map(function (m) { var r = m.getBoundingClientRect(); return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2]; });
    if (!marks.length || getComputedStyle(svg).display === 'none') return;
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + Math.max(1, box.height));
    var d = 'M' + (marks[0][0] - 60) + ' ' + marks[0][1] + ' L' + marks[0][0] + ' ' + marks[0][1];
    for (var i = 1; i < marks.length; i++) {
      var a = marks[i - 1], b = marks[i], mx = (a[0] + b[0]) / 2;
      d += ' C' + mx + ' ' + a[1] + ' ' + mx + ' ' + b[1] + ' ' + b[0] + ' ' + b[1];
    }
    var last = marks[marks.length - 1];
    d += ' L' + Math.min(box.width - 4, last[0] + 140) + ' ' + last[1];
    rpath.setAttribute('d', d);
  }
  drawRoute();
  window.addEventListener('resize', drawRoute);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawRoute);

  /* ---------- services as chart legends ---------- */
  var SYM = { 'Build': 'tri', 'Buy & sell': 'ci', 'Advise': 'sq' };
  var groups = [];
  T.services.forEach(function (s) { if (groups.indexOf(s.group) < 0) groups.push(s.group); });
  $('[data-services]').innerHTML = groups.map(function (g, gi) {
    var items = T.services.filter(function (s) { return s.group === g; });
    return '<section class="lg" aria-labelledby="lg-' + gi + '"><h3 class="lg__t" id="lg-' + gi + '"><span class="key__sym key__sym--' + SYM[g] + '" aria-hidden="true"></span>' + esc(g) +
      '<span class="lg__c">' + items.length + ' entries</span></h3><dl class="lg__l">' +
      items.map(function (s, i) {
        return '<div><dt><span class="lg__k" aria-hidden="true">' + String.fromCharCode(65 + gi) + (i + 1) + '</span>' + esc(s.title) + '</dt><dd>' + esc(s.text) + '</dd></div>';
      }).join('') + '</dl></section>';
  }).join('');

  /* ---------- interest prefill ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (!a) return;
    var sel = $('#interest'), v = a.getAttribute('data-interest');
    if (!$$('option', sel).some(function (o) { return o.value === v; })) {
      var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o);
    }
    sel.value = v;
  });

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sh, .key__list li, .sheet, .route__wrap, .lg, .location__fig, .bearings li, .port-card, .form').forEach(function (el) { el.classList.add('rv'); io.observe(el); });
  }

  $('[data-year]').textContent = new Date().getFullYear();
})();
