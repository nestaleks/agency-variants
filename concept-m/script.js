/* Concept M — Dossier: report cover, SVG charts from unit data, numbered exhibits, print one-pagers */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- derived figures (all computed from shared/data.js) ---------- */
  var all = [];
  T.projects.forEach(function (p, pi) { p.units.forEach(function (u) { all.push({ p: p, pi: pi, u: u }); }); });
  var sold = function (p) { return p.status === 'sold'; };
  var areas = all.map(function (x) { return x.u.area; }).sort(function (a, b) { return a - b; });
  var median = areas.length % 2 ? areas[(areas.length - 1) / 2] : (areas[areas.length / 2 - 1] + areas[areas.length / 2]) / 2;
  var sum = function (arr) { return arr.reduce(function (a, b) { return a + b; }, 0); };
  var num = function (n, d) { return n.toLocaleString('en-GB', { minimumFractionDigits: d || 0, maximumFractionDigits: d === undefined ? 2 : d }); };
  var m2 = function (n) { return num(n, 2) + ' m²'; };
  var progP = T.projects.filter(function (p) { return !sold(p); }), soldP = T.projects.filter(sold);
  var homesOf = function (ps) { return sum(ps.map(function (p) { return p.units.length; })); };
  var exNo = function (pi) { return '2.' + (pi + 1); };
  function unitLabel(units) {
    var ns = units.map(function (u) { return u.n; });
    if (ns.length === 1) return 'apartment ' + ns[0];
    var run = ns.every(function (n, i) { return i === 0 || n === ns[i - 1] + 1; });
    return 'apartments ' + (run && ns.length > 2 ? ns[0] + '–' + ns[ns.length - 1] : ns.slice(0, -1).join(', ') + ' and ' + ns[ns.length - 1]);
  }

  /* ---------- header: menu, running head ---------- */
  var menu = $('[data-menu]'), nav = $('[data-nav]'), menuLabel = $('[data-menu-label]');
  function setMenu(o) {
    menu.setAttribute('aria-expanded', String(o));
    nav.classList.toggle('is-open', o);
    menuLabel.textContent = o ? 'Close' : 'Contents';
  }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menu.focus(); }
  });
  window.addEventListener('scroll', function () { $('[data-head]').classList.toggle('is-scrolled', window.scrollY > 8); }, { passive: true });

  /* ---------- cover ---------- */
  $('[data-cover-homes]').textContent = all.length;
  $('[data-cover-homes2]').textContent = all.length;
  $('[data-cover-buildings]').textContent = T.projects.length;
  $$('[data-n-homes]').forEach(function (e) { e.textContent = all.length; });
  $('[data-plates]').innerHTML = T.projects.map(function (p, i) {
    return '<li><a href="#ex-' + p.id + '" class="plate">' +
      '<span class="plate__img"><img src="' + T.img(p.card) + '" alt="" width="640" height="420" loading="lazy"></span>' +
      '<span class="plate__n">' + exNo(i) + '</span><span class="plate__name">' + esc(p.name) + '</span>' +
      '<span class="plate__meta">' + esc(p.area) + ' · ' + p.units.length + ' homes · ' + (sold(p) ? 'Sold' : 'In progress') + '</span></a></li>';
  }).join('');

  /* ---------- 1.1 key figures ---------- */
  var withOutdoor = all.filter(function (x) { return T.outdoor(x.u); }).length;
  var duplex = all.filter(function (x) { return x.u.duplex; }).length;
  var palma = T.projects.filter(function (p) { return p.city === 'Palma'; }).length;
  var kf = [
    ['Buildings', T.projects.length, progP.length + ' in progress · ' + soldP.length + ' completed and sold'],
    ['Published homes', all.length, homesOf(progP) + ' in progress · ' + homesOf(soldP) + ' sold'],
    ['Interior area, smallest – largest', m2(areas[0]) + ' – ' + m2(areas[areas.length - 1]), 'see Figure 2'],
    ['Interior area, median', m2(median), 'middle value of ' + all.length + ' homes'],
    ['Interior area, all homes', num(Math.round(sum(areas))) + ' m²', 'sum, excluding outdoor space'],
    ['Homes with private outdoor space', withOutdoor + ' of ' + all.length, 'terrace, balcony or garden'],
    ['Duplex homes', duplex, 'on two levels'],
    ['Locations', 'Palma · Port de Sóller', palma + ' buildings in Palma, ' + (T.projects.length - palma) + ' in Port de Sóller']
  ];
  $('[data-kf] tbody').innerHTML = kf.map(function (r) {
    return '<tr><th scope="row">' + r[0] + '</th><td class="kf__v">' + r[1] + '</td><td class="kf__note">' + r[2] + '</td></tr>';
  }).join('');

  /* ---------- SVG helpers ---------- */
  function el(name, attrs, text) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function svgRoot(w, h, label) {
    return el('svg', { width: w, height: h, viewBox: '0 0 ' + w + ' ' + h, role: 'img', 'aria-label': label, class: 'svg' });
  }

  /* ---------- Figure 1: homes per building ---------- */
  function renderBars() {
    var host = $('[data-chart-bars]'), W = host.clientWidth;
    if (!W) return;
    var narrow = W < 520, padL = narrow ? 0 : 190, padR = 40, rowH = narrow ? 46 : 34, top = 8, max = 10, lab = narrow ? 12 : 0;
    var H = top + T.projects.length * rowH + 28;
    var label = 'Bar chart: ' + T.projects.map(function (p) { return p.name + ' ' + p.units.length + ' homes'; }).join('; ');
    var s = svgRoot(W, H, label), x = function (v) { return padL + v / max * (W - padL - padR); };
    for (var t = 0; t <= max; t += 2) {
      s.appendChild(el('line', { x1: x(t), x2: x(t), y1: top - 4, y2: H - 22, class: 'grid' }));
      s.appendChild(el('text', { x: x(t), y: H - 6, class: 'tick', 'text-anchor': 'middle' }, t));
    }
    T.projects.forEach(function (p, i) {
      var y = top + i * rowH;
      s.appendChild(el('text', { x: 0, y: narrow ? y + 12 : y + rowH / 2 + 4, class: narrow ? 'rowlab rowlab--sm' : 'rowlab' }, exNo(i) + '  ' + p.name));
      var g = el('g', { class: 'bar ' + (sold(p) ? 'is-sold' : 'is-prog'), style: '--d:' + (i * 80) + 'ms' });
      g.appendChild(el('rect', { x: padL, y: y + 8 + lab, width: x(p.units.length) - padL, height: narrow ? 18 : rowH - 16 }));
      s.appendChild(g);
      s.appendChild(el('text', { x: x(p.units.length) + 6, y: narrow ? y + 8 + lab + 13 : y + rowH / 2 + 4, class: 'val' }, p.units.length));
    });
    host.innerHTML = ''; host.appendChild(s);
  }

  /* ---------- Figure 2: interior-area strip plot ---------- */
  var marks = [], active = 0;
  var tip = $('[data-tip]');
  var stripHost = $('[data-chart-strip]');
  var stripBox = document.createElement('div');
  stripBox.className = 'strip__svg';
  stripHost.insertBefore(stripBox, tip);

  function groupsOf(p) {
    var gs = [];
    p.units.forEach(function (u) {
      var g = gs.filter(function (x) { return x.area === u.area && x.beds === u.beds && x.baths === u.baths; })[0];
      if (g) g.units.push(u); else gs.push({ area: u.area, beds: u.beds, baths: u.baths, units: [u] });
    });
    return gs.sort(function (a, b) { return a.area - b.area; });
  }

  function renderStrip() {
    var W = stripBox.clientWidth;
    if (!W) return;
    var narrow = W < 560, padL = narrow ? 14 : 172, padR = 18, top = narrow ? 32 : 26, rowH = narrow ? 84 : 58;
    var lo = 40, hi = 220, step = narrow ? 40 : 20;
    var H = top + T.projects.length * rowH + 34;
    var s = svgRoot(W, H, 'Strip plot of interior areas; ' + all.length + ' homes, median ' + m2(median) + '. Marks are focusable with details.');
    s.setAttribute('role', 'group');
    var x = function (v) { return padL + (v - lo) / (hi - lo) * (W - padL - padR); };
    for (var t = lo; t <= hi; t += step) {
      s.appendChild(el('line', { x1: x(t), x2: x(t), y1: top - 10, y2: H - 28, class: 'grid' }));
      s.appendChild(el('text', { x: x(t), y: H - 10, class: 'tick', 'text-anchor': 'middle' }, t));
    }
    s.appendChild(el('text', { x: W - padR, y: H - 10 - 14, class: 'tick tick--unit', 'text-anchor': 'end' }, 'm² interior'));
    // median
    s.appendChild(el('line', { x1: x(median), x2: x(median), y1: top - 16, y2: H - 28, class: 'median' }));
    s.appendChild(el('text', { x: x(median) + 5, y: top - (narrow ? 18 : 10), class: 'medlab' }, 'median ' + num(median, 2)));

    marks = [];
    T.projects.forEach(function (p, i) {
      var cy0 = top + i * rowH + rowH / 2;
      s.appendChild(el('line', { x1: narrow ? 0 : padL, x2: W - padR, y1: top + (i + 1) * rowH, y2: top + (i + 1) * rowH, class: 'rowrule' }));
      if (narrow) {
        s.appendChild(el('text', { x: 0, y: top + i * rowH + 14, class: 'rowlab rowlab--sm' }, exNo(i) + ' ' + p.name));
      } else {
        s.appendChild(el('text', { x: 0, y: cy0 + 4, class: 'rowlab' }, exNo(i) + '  ' + p.name));
      }
      var placed = [];
      groupsOf(p).forEach(function (g) {
        var r = g.units.length > 1 ? 9 : 6, cx = x(g.area), cy = narrow ? top + i * rowH + 52 : cy0;
        var offs = narrow ? [0, 1, -1, 2, -2] : [0, -1, 1, -2, 2];
        for (var k = 0; k < offs.length; k++) {
          var cand = cy + offs[k] * 11;
          if (!placed.some(function (q) { return Math.hypot(q.cx - cx, q.cy - cand) < q.r + r + 1.5; })) { cy = cand; break; }
        }
        placed.push({ cx: cx, cy: cy, r: r });
        var st = sold(p) ? 'completed, sold' : 'in progress';
        var o = g.units.map(function (u) { return T.outdoor(u); }).filter(Boolean)[0];
        var desc = p.name + ', ' + unitLabel(g.units) + ': ' + m2(g.area) + ' interior, ' + g.beds + ' bedroom' + (g.beds > 1 ? 's' : '') + ', ' + g.baths + ' bathroom' + (g.baths > 1 ? 's' : '') + ', ' + st;
        var mk = el('g', { class: 'mk ' + (sold(p) ? 'is-sold' : 'is-prog'), tabindex: '-1', role: 'img', 'aria-label': desc + '. Press Enter to open in exhibit ' + exNo(i) + '.', 'data-target': 'u-' + p.id + '-' + g.units[0].n });
        mk.appendChild(el('circle', { cx: cx, cy: cy, r: r + 7, class: 'mk__hit' }));
        mk.appendChild(el('circle', { cx: cx, cy: cy, r: r, class: 'mk__dot' }));
        if (g.units.length > 1) mk.appendChild(el('text', { x: cx, y: cy + 3.5, class: 'mk__n', 'text-anchor': 'middle' }, g.units.length));
        s.appendChild(mk);
        marks.push({ node: mk, cx: cx, cy: cy, r: r, p: p, g: g, o: o, st: st, i: i });
      });
    });
    stripBox.innerHTML = ''; stripBox.appendChild(s);
    active = Math.min(active, marks.length - 1);
    marks[active].node.setAttribute('tabindex', '0');
    marks.forEach(function (m, idx) {
      m.node.addEventListener('mouseenter', function () { showTip(m); });
      m.node.addEventListener('mouseleave', function () { if (document.activeElement !== m.node) hideTip(); });
      m.node.addEventListener('focus', function () { setActive(idx, false); showTip(m); });
      m.node.addEventListener('blur', hideTip);
      m.node.addEventListener('click', function () { openUnit(m); });
    });
  }
  function setActive(idx, focus) {
    marks.forEach(function (m, k) { m.node.setAttribute('tabindex', k === idx ? '0' : '-1'); });
    active = idx;
    if (focus) marks[idx].node.focus();
  }
  function showTip(m) {
    var g = m.g;
    tip.innerHTML = '<span class="tip__ref">Exhibit ' + exNo(m.i) + ' · ' + esc(m.p.name) + '</span>' +
      '<strong>' + m2(g.area) + '</strong> <span class="tip__k">interior</span>' +
      '<span class="tip__row">' + esc(unitLabel(g.units).replace(/^a/, 'A')) + (g.units.length > 1 ? ' (×' + g.units.length + ')' : '') + '</span>' +
      '<span class="tip__row">' + g.beds + ' bed · ' + g.baths + ' bath' + (m.o ? ' · ' + m.o.label.toLowerCase() + ' ' + m2(m.o.value) : '') + '</span>' +
      '<span class="tip__row tip__st">' + (sold(m.p) ? 'Sold' : 'In progress · Price on request') + '</span>';
    tip.hidden = false;
    var bw = stripHost.clientWidth, tw = tip.offsetWidth, left = m.cx - tw / 2;
    left = Math.max(0, Math.min(bw - tw, left));
    tip.style.left = left + 'px';
    var above = m.cy - m.r - 10 - tip.offsetHeight;
    tip.style.top = (above > 0 ? above : m.cy + m.r + 10) + 'px';
  }
  function hideTip() { tip.hidden = true; }
  stripHost.addEventListener('keydown', function (e) {
    var k = e.key, idx = active;
    if (k === 'ArrowRight' || k === 'ArrowDown') idx = Math.min(marks.length - 1, active + 1);
    else if (k === 'ArrowLeft' || k === 'ArrowUp') idx = Math.max(0, active - 1);
    else if (k === 'Home') idx = 0;
    else if (k === 'End') idx = marks.length - 1;
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); openUnit(marks[active]); return; }
    else if (k === 'Escape') { hideTip(); return; }
    else return;
    e.preventDefault();
    setActive(idx, true);
  });

  function openUnit(m) {
    var row = document.getElementById(m.node.getAttribute('data-target'));
    if (!row) return;
    hideTip();
    $$('.sched tr.is-hl').forEach(function (r) { r.classList.remove('is-hl'); });
    m.g.units.forEach(function (u) { var r = document.getElementById('u-' + m.p.id + '-' + u.n); if (r) r.classList.add('is-hl'); });
    row.scrollIntoView({ behavior: T.reducedMotion() ? 'auto' : 'smooth', block: 'center' });
    row.querySelector('th').focus({ preventScroll: true });
  }

  /* table alternative */
  $('[data-strip-table] tbody').innerHTML = all.map(function (x) {
    return '<tr><td>' + exNo(x.pi) + ' ' + esc(x.p.name) + '</td><td>' + x.u.n + '</td><td class="r">' + m2(x.u.area) + '</td><td class="r">' + x.u.beds + '</td><td class="r">' + x.u.baths + '</td><td>' + (sold(x.p) ? 'Sold' : 'In progress') + '</td></tr>';
  }).join('');
  var tbtn = $('[data-strip-toggle]'), twrap = $('#strip-table');
  tbtn.addEventListener('click', function () {
    var o = tbtn.getAttribute('aria-expanded') !== 'true';
    tbtn.setAttribute('aria-expanded', String(o));
    twrap.hidden = !o;
    tbtn.textContent = o ? 'Hide data table' : 'Show data as table';
  });

  /* ---------- Figure 3: bedroom mix ---------- */
  function renderBeds() {
    var host = $('[data-chart-beds]'), W = host.clientWidth;
    if (!W) return;
    var counts = {};
    all.forEach(function (x) { counts[x.u.beds] = (counts[x.u.beds] || 0) + 1; });
    var keys = Object.keys(counts).sort();
    var narrow = W < 560, barY = 10, barH = 34, acc = 0, total = all.length;
    var H = barY + barH + (narrow ? 22 + keys.length * 24 : 52);
    var s = svgRoot(W, H, 'Bedroom mix: ' + keys.map(function (k) { return counts[k] + ' homes with ' + k + ' bedroom' + (k > 1 ? 's' : ''); }).join(', '));
    keys.forEach(function (k, i) {
      var w = counts[k] / total * W, x0 = acc / total * W;
      s.appendChild(el('rect', { x: x0, y: barY, width: Math.max(w - 2, 1), height: barH, class: 'seg seg--' + i }));
      if (w > 28) s.appendChild(el('text', { x: x0 + 8, y: barY + barH / 2 + 5, class: 'seg__v seg__v--' + i }, counts[k]));
      var lx = narrow ? 0 : i * 230, ly = narrow ? barY + barH + 26 + i * 24 : barY + barH + 34;
      s.appendChild(el('rect', { x: lx, y: ly - 10, width: 12, height: 12, class: 'seg seg--' + i + ' lgsw' }));
      s.appendChild(el('text', { x: lx + 20, y: ly, class: 'tick tick--dark' }, k + ' bedroom' + (k > 1 ? 's' : '') + ' — ' + counts[k] + ' homes, ' + num(counts[k] / total * 100, 1) + '%'));
      acc += counts[k];
    });
    host.innerHTML = ''; host.appendChild(s);
  }

  /* ---------- 2. exhibits ---------- */
  $('[data-exhibits]').innerHTML = T.projects.map(function (p, i) {
    var id = p.id, no = exNo(i), isSold = sold(p);
    var ar = p.units.map(function (u) { return u.area; });
    var hasDuplex = p.units.some(function (u) { return u.duplex; });
    var facts = p.facts.filter(function (f) { return f[0] !== 'Status'; }).map(function (f) { return '<tr><th scope="row">' + esc(f[0]) + '</th><td>' + esc(f[1]) + '</td></tr>'; }).join('') +
      '<tr><th scope="row">Homes published</th><td>' + p.units.length + '</td></tr>' +
      '<tr><th scope="row">Interior areas</th><td>' + (Math.min.apply(null, ar) === Math.max.apply(null, ar) ? m2(ar[0]) : m2(Math.min.apply(null, ar)) + ' – ' + m2(Math.max.apply(null, ar))) + '</td></tr>' +
      '<tr><th scope="row">Amenities</th><td>' + p.amenities.map(esc).join(', ') + '</td></tr>' +
      '<tr><th scope="row">Status</th><td>' + (isSold ? 'Completed · sold' : 'In progress') + '</td></tr>';
    var rows = p.units.map(function (u) {
      var o = T.outdoor(u);
      return '<tr id="u-' + id + '-' + u.n + '"><th scope="row" tabindex="-1">' + u.n + (u.duplex ? '<abbr title="Duplex" class="dx">D</abbr>' : '') + '</th>' +
        '<td class="r">' + num(u.area, 2) + '</td><td class="r">' + u.beds + '</td><td class="r">' + u.baths + '</td>' +
        '<td>' + (o ? o.label + ' <span class="r-n">' + num(o.value, 2) + '</span>' : '<span class="muted">—</span>') + '</td>' +
        '<td class="pr">' + (isSold ? '<span class="st st--sold">Sold</span>' : 'Price on request') + '</td></tr>';
    }).join('');
    var notes = [
      isSold ? 'Completed and sold; included as a reference of delivered work.' : 'Prices on request; availability to be confirmed with TID group.',
      'Image may be an architectural visualisation.'
    ];
    if (hasDuplex) notes.push('D = duplex, a home on two levels.');
    return '<article class="ex rv" id="ex-' + id + '" aria-labelledby="ex-' + id + '-h" data-ex="' + no + ' ' + esc(p.name) + '">' +
      '<div class="ex__margin"><p class="ex__ref">Exhibit</p><p class="ex__num">' + no + '</p>' +
      '<p class="ex__status ' + (isSold ? 'is-sold' : 'is-prog') + '">' + (isSold ? 'Completed · sold' : 'In progress') + '</p></div>' +
      '<div class="ex__main">' +
        '<header class="ex__head"><h3 class="ex__h" id="ex-' + id + '-h"><span class="vh">Exhibit ' + no + ': </span>' + esc(p.name) + '</h3>' +
        '<p class="ex__loc">' + esc(p.area) + ', ' + esc(p.city) + '</p>' +
        '<p class="ex__headline">' + esc(p.headline) + ' <span lang="es">· ' + esc(p.headlineEs) + '</span></p></header>' +
        '<div class="ex__top">' +
          '<figure class="ex__fig"><img src="' + T.img(p.gallery[0]) + '" alt="' + esc(p.name) + ', ' + esc(p.area) + ': exterior view of the building" width="1920" height="1080" loading="lazy">' +
          '<figcaption>Plate ' + no + ' — ' + esc(p.name) + ', ' + esc(p.area) + '.<sup class="fn"><a href="#fn-' + id + '-2" id="fnref-' + id + '-2" aria-label="Note 2">2</a></sup></figcaption></figure>' +
          '<div class="ex__text"><p>' + esc(p.summary) + '</p>' +
          '<table class="facts"><caption>Particulars</caption><tbody>' + facts + '</tbody></table></div>' +
        '</div>' +
        '<h4 class="ex__sh"><span class="sub__n">' + no + '.1</span> Unit schedule</h4>' +
        '<div class="tablewrap" tabindex="0" role="region" aria-label="Unit schedule, ' + esc(p.name) + '">' +
        '<table class="sched"><caption class="vh">Unit schedule of ' + esc(p.name) + '. Areas in square metres.</caption>' +
        '<thead><tr><th scope="col">No.</th><th scope="col" class="r">Interior m²</th><th scope="col" class="r">Bed</th><th scope="col" class="r">Bath</th><th scope="col">Outdoor m²</th><th scope="col">Price<sup class="fn"><a href="#fn-' + id + '-1" id="fnref-' + id + '-1" aria-label="Note 1">1</a></sup></th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '<tfoot><tr><th scope="row">Total</th><td class="r">' + num(sum(ar), 2) + '</td><td class="r">' + sum(p.units.map(function (u) { return u.beds; })) + '</td><td class="r">' + sum(p.units.map(function (u) { return u.baths; })) + '</td><td colspan="2">' + p.units.length + ' homes</td></tr></tfoot>' +
        '</table></div>' +
        '<ol class="ex__notes">' + notes.map(function (n, k) {
          var back = k < 2 ? ' <a href="#fnref-' + id + '-' + (k + 1) + '" class="fn-back" aria-label="Back to reference ' + (k + 1) + '">↩</a>' : '';
          return '<li' + (k < 2 ? ' id="fn-' + id + '-' + (k + 1) + '"' : '') + '>' + n + back + '</li>';
        }).join('') + '</ol>' +
        '<div class="ex__actions">' +
          '<a class="btn btn--solid" href="#enquire" data-interest="' + esc(isSold ? 'Homes similar to ' + p.name : p.name) + '">' + (isSold ? 'Ask about similar homes' : 'Enquire about ' + esc(p.name)) + '</a>' +
          '<button class="btn btn--line" type="button" data-print-one="' + id + '">Download one-pager<span class="vh"> for ' + esc(p.name) + '</span></button>' +
          '<span class="ex__hint">Opens the print dialog — choose “Save as PDF”.</span>' +
        '</div>' +
      '</div></article>';
  }).join('');

  /* ---------- 3. services ---------- */
  var groups = [['Build', 'Custom construction', 'Discuss a construction'], ['Buy & sell', 'Selling my property', 'Discuss a sale'], ['Advise', 'Investment consultation', 'Arrange a consultation']];
  var sn = 0;
  $('[data-services]').innerHTML = groups.map(function (g) {
    var items = T.services.filter(function (s) { return s.group === g[0]; });
    return '<div class="svc__col rv"><h3 class="svc__h">' + esc(g[0]) + '</h3><ol class="svc__list">' + items.map(function (s) {
      sn++;
      return '<li><span class="svc__n">3.' + sn + '</span><span class="svc__t">' + esc(s.title) + '</span><span class="svc__d">' + esc(s.text) + '</span></li>';
    }).join('') + '</ol><a class="arrow" href="#enquire" data-interest="' + esc(g[1]) + '">' + g[2] + '</a></div>';
  }).join('');

  /* ---------- 4. process ---------- */
  $('[data-process] tbody').innerHTML = T.process.map(function (s, i) {
    return '<tr class="rv"><td class="proc__ref">4.' + (i + 1) + '</td><th scope="row" class="proc__st">' + esc(s.step) + '</th><td class="proc__sc">' + esc(s.title) + '</td><td>' + esc(s.text) + '</td></tr>';
  }).join('');

  /* ---------- 5. pillars ---------- */
  $('[data-pillars]').innerHTML = T.company.pillars.map(function (p, i) {
    return '<div><dt><span class="sub__n">' + ['i', 'ii', 'iii', 'iv'][i] + '</span>' + esc(p.title) + '</dt><dd>' + esc(p.text) + '</dd></div>';
  }).join('');

  /* ---------- interest prefill ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (!a) return;
    var sel = $('#interest'), v = a.getAttribute('data-interest');
    if (!$$('option', sel).some(function (o) { return o.value === v; })) { var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); }
    sel.value = v;
  });

  /* ---------- print ---------- */
  var root = document.documentElement;
  function clearPrint() {
    root.classList.remove('print-one');
    $$('.ex.is-print').forEach(function (x) { x.classList.remove('is-print'); });
  }
  window.addEventListener('afterprint', clearPrint);
  document.addEventListener('click', function (e) {
    var one = e.target.closest('[data-print-one]'), allBtn = e.target.closest('[data-print-all]');
    if (one) {
      clearPrint();
      root.classList.add('print-one');
      document.getElementById('ex-' + one.getAttribute('data-print-one')).classList.add('is-print');
      window.print();
    } else if (allBtn) {
      clearPrint();
      window.print();
    }
  });

  /* ---------- charts: render + resize ---------- */
  function renderCharts() { renderBars(); renderStrip(); renderBeds(); }
  renderCharts();
  var lastW = window.innerWidth, rt;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth; clearTimeout(rt); rt = setTimeout(renderCharts, 120);
  });
  window.addEventListener('beforeprint', renderCharts);

  /* ---------- running head + reveal ---------- */
  var runhead = $('[data-runhead]');
  if ('IntersectionObserver' in window) {
    var cur = {};
    var ioHead = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) cur[en.target.hasAttribute('data-ex') ? 'ex' : 'sec'] = en.target; else if (cur.ex === en.target) cur.ex = null; });
      var s = cur.sec;
      var txt = 'Cover';
      if (s && s.hasAttribute('data-sec')) {
        txt = '§ ' + s.getAttribute('data-sec');
        if (cur.ex && s.id === 'exhibits') txt = '§ Exhibit ' + cur.ex.getAttribute('data-ex');
      }
      runhead.textContent = txt;
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('#top, [data-sec], [data-ex]').forEach(function (s) { ioHead.observe(s); });

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec__head, .rv, .fig, .kf, .cons__item, .enq').forEach(function (x) { x.classList.add('q'); io.observe(x); });
  }

  $('[data-year]').textContent = new Date().getFullYear();
})();
