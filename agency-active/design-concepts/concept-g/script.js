/* Concept G — Obra: site board, project ticker, spec-sheet cards with unit tables, plan viewer (zoom / pan / keyboard) */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var ORDER = ['marina-residence', 'foners-club', 'can-marques', 'solivar', 'boho-corner'];
  var PROJECTS = ORDER.map(T.project);
  var ALT = {
    'marina-residence': 'Marina Residence: rendering of a stone-clad corner building with glass balconies and a rooftop terrace, palm trees and the sea of El Arenal behind',
    'foners-club': 'Foners Club: rendering of the street façade with stone-panelled balconies above ground-floor commercial premises',
    'can-marques': 'Can Marquès: rendering of the courtyard pool and sun loungers in front of a façade with timber slats',
    'solivar': 'S’Olivar: white façade with stone panels and glass balconies among pines, Port de Sóller',
    'boho-corner': 'Boho Corner: rendering of a two-storey stone corner building with timber shutters and planted roof terraces, El Terreno'
  };
  var sold = function (p) { return p.status === 'sold'; };

  /* ---------- header & mobile menu ---------- */
  var hd = $('[data-hd]'), menu = $('[data-menu]'), nav = $('[data-nav]');
  window.addEventListener('scroll', function () { hd.classList.toggle('is-stuck', window.scrollY > 8); }, { passive: true });
  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    $('[data-menu-label]').textContent = open ? 'Close' : 'Menu';
  }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menu.focus(); }
  });

  /* ---------- site board ---------- */
  $('[data-board]').innerHTML = PROJECTS.map(function (p, i) {
    return '<li><a href="#p-' + p.id + '">' +
      '<span class="board__n">' + pad(i + 1) + '</span>' +
      '<span class="board__name">' + esc(p.name) + '<small>' + esc(p.area) + '</small></span>' +
      '<span class="board__u">' + p.units.length + ' apts</span>' +
      '<span class="tag' + (sold(p) ? '' : ' tag--y') + '">' + (sold(p) ? 'Sold' : 'In progress') + '</span></a></li>';
  }).join('');
  $('[data-board-total]').textContent = PROJECTS.reduce(function (s, p) { return s + p.units.length; }, 0);

  /* ---------- ticker ---------- */
  var tickItems = PROJECTS.map(function (p) {
    return '<li><b>' + esc(p.name) + '</b> ' + esc(p.area) + ' · ' + p.units.length + ' apartments · ' + (sold(p) ? 'Sold' : 'In progress') + '</li>';
  }).join('');
  var track = $('[data-ticker-track]');
  track.innerHTML = tickItems;
  var clone = track.cloneNode(true);
  clone.removeAttribute('data-ticker-track'); clone.removeAttribute('aria-label');
  clone.setAttribute('aria-hidden', 'true'); clone.classList.add('ticker__track--clone');
  track.parentNode.appendChild(clone);
  var ticker = $('[data-ticker]'), tbtn = $('[data-ticker-btn]');
  tbtn.addEventListener('click', function () {
    var paused = tbtn.getAttribute('aria-pressed') !== 'true';
    tbtn.setAttribute('aria-pressed', String(paused));
    ticker.classList.toggle('is-paused', paused);
    $('.sr', tbtn).textContent = paused ? 'Play the project ticker' : 'Pause the project ticker';
  });

  /* ---------- spec sheets ---------- */
  function unitRows(p) {
    return p.units.map(function (u, i) {
      var o = T.outdoor(u);
      return '<tr><th scope="row">' + pad(u.n) + '</th>' +
        '<td data-l="Interior">' + T.fmtArea(u.area) + '</td>' +
        '<td data-l="Beds">' + u.beds + '</td>' +
        '<td data-l="Baths">' + u.baths + '</td>' +
        '<td data-l="Outdoor">' + (o ? o.label + ' ' + T.fmtArea(o.value) : '—') + '</td>' +
        '<td data-l="Type">' + (u.duplex ? 'Duplex' : 'Apartment') + '</td>' +
        '<td data-l="Status">' + (sold(p) ? '<span class="tag">Sold</span>' : 'Price on request') + '</td>' +
        '<td class="u-plan"><button type="button" class="planbtn" data-plan="' + p.id + '" data-i="' + i + '" aria-label="Floor plan of apartment ' + u.n + ', ' + esc(p.name) + '">Plan <span aria-hidden="true">↗</span></button></td></tr>';
    }).join('');
  }
  $('[data-sheets]').innerHTML = PROJECTS.map(function (p, i) {
    var s = sold(p);
    return '<article class="sheet rv" id="p-' + p.id + '" data-status="' + p.status + '" aria-labelledby="pn-' + p.id + '">' +
      '<div class="sheet__top"><span>Spec sheet Nº ' + pad(i + 1) + ' / 05</span><span class="tag' + (s ? '' : ' tag--y') + '">' + (s ? 'Completed · Sold' : 'In progress') + '</span></div>' +
      '<div class="sheet__body">' +
        '<figure class="sheet__fig"><img src="' + T.img(p.gallery[0]) + '" alt="' + esc(ALT[p.id]) + '" width="1920" height="1080" loading="lazy"></figure>' +
        '<div class="sheet__spec">' +
          '<p class="sheet__loc">' + esc(p.area) + ' · ' + esc(p.city) + '</p>' +
          '<h3 class="sheet__name" id="pn-' + p.id + '">' + esc(p.name) + '</h3>' +
          '<p class="sheet__hl">' + esc(p.headline) + ' <span lang="es">/ ' + esc(p.headlineEs) + '</span></p>' +
          '<p class="sheet__sum">' + esc(p.summary) + '</p>' +
          '<dl class="sheet__facts">' + p.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
          '<ul class="sheet__am" aria-label="Amenities">' + p.amenities.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
          '<div class="sheet__acts">' +
            '<button type="button" class="btn btn--k" aria-expanded="false" aria-controls="u-' + p.id + '" data-units>Unit table <span class="cnt">' + p.units.length + '</span></button>' +
            '<a class="btn btn--o" href="#contact" data-interest="' + (s ? 'Homes similar to ' + esc(p.name) : esc(p.name)) + '">' + (s ? 'Ask about similar homes' : 'Enquire') + '</a>' +
            '<p class="sheet__price">' + (s ? 'All homes sold' : 'Price on request') + '</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="sheet__units" id="u-' + p.id + '" hidden>' +
        '<table class="ut"><caption>' + p.units.length + ' apartments in ' + esc(p.name) + ' — areas in m², select “Plan” to open the drawing</caption>' +
        '<thead><tr><th scope="col">Nº</th><th scope="col">Interior</th><th scope="col">Beds</th><th scope="col">Baths</th><th scope="col">Outdoor</th><th scope="col">Type</th><th scope="col">Status</th><th scope="col"><span class="sr">Floor plan</span></th></tr></thead>' +
        '<tbody>' + unitRows(p) + '</tbody></table>' +
      '</div>' +
    '</article>';
  }).join('');

  $('[data-sheets]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-units]');
    if (b) {
      var open = b.getAttribute('aria-expanded') !== 'true';
      var panel = document.getElementById(b.getAttribute('aria-controls'));
      b.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      b.closest('.sheet').classList.toggle('is-open', open);
      return;
    }
    var pb = e.target.closest('[data-plan]');
    if (pb) openPlan(pb.getAttribute('data-plan'), +pb.getAttribute('data-i'), pb);
  });

  /* filters */
  ['all', 'in-progress', 'sold'].forEach(function (k) {
    $('[data-count="' + k + '"]').textContent = PROJECTS.filter(function (p) { return k === 'all' || p.status === k; }).length;
  });
  $$('[data-filter]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-filter');
      $$('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.sheet').forEach(function (s) { s.hidden = !(k === 'all' || s.getAttribute('data-status') === k); });
    });
  });

  /* ---------- plan viewer ---------- */
  var dlg = $('[data-pv]'), stage = $('[data-pv-stage]'), img = $('[data-pv-img]');
  var STEPS = [1, 1.5, 2, 3, 4];
  var st = { p: null, i: 0, z: 0, x: 0, y: 0, opener: null };

  function clamp() {
    var s = STEPS[st.z], w = stage.clientWidth, h = stage.clientHeight;
    var mx = (s - 1) * w / 2, my = (s - 1) * h / 2;
    st.x = Math.max(-mx, Math.min(mx, st.x));
    st.y = Math.max(-my, Math.min(my, st.y));
  }
  function apply() {
    clamp();
    img.style.transform = 'translate(' + st.x + 'px,' + st.y + 'px) scale(' + STEPS[st.z] + ')';
    $('[data-pv-lvl]').textContent = Math.round(STEPS[st.z] * 100) + '%';
    $('[data-pv-zoom="-1"]').disabled = st.z === 0;
    $('[data-pv-zoom="1"]').disabled = st.z === STEPS.length - 1;
    stage.classList.toggle('is-zoomed', st.z > 0);
    if (dlg.open && document.activeElement && document.activeElement.disabled) stage.focus();
  }
  function zoom(d) {
    var nz = Math.max(0, Math.min(STEPS.length - 1, st.z + d));
    var k = STEPS[nz] / STEPS[st.z];
    st.x *= k; st.y *= k; st.z = nz; apply();
  }
  function reset() { st.z = 0; st.x = 0; st.y = 0; apply(); }
  function show() {
    var p = st.p, u = p.units[st.i], o = T.outdoor(u);
    $('[data-pv-proj]').textContent = p.name + ' · ' + p.area;
    $('[data-pv-title]').textContent = 'Apartment ' + pad(u.n) + (u.duplex ? ' — duplex' : '');
    $('[data-pv-spec]').innerHTML = [['Interior', T.fmtArea(u.area)], ['Bedrooms', u.beds], ['Bathrooms', u.baths], [o ? o.label : 'Outdoor', o ? T.fmtArea(o.value) : '—'], ['Status', sold(p) ? 'Sold' : 'Price on request']]
      .map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
    img.src = T.img(u.plan);
    img.alt = 'Floor plan of apartment ' + u.n + ' in ' + p.name + ': ' + u.beds + ' bedrooms, ' + u.baths + ' bathrooms, ' + T.fmtArea(u.area) + ' interior' + (o ? ', ' + o.label.toLowerCase() + ' ' + T.fmtArea(o.value) : '');
    $('[data-pv-count]').textContent = (st.i + 1) + ' / ' + p.units.length;
    var cta = $('[data-pv-cta]');
    cta.textContent = sold(p) ? 'Ask about similar homes' : 'Request apartment ' + pad(u.n);
    cta.setAttribute('data-interest', sold(p) ? 'Homes similar to ' + p.name : p.name);
    cta.setAttribute('data-msg', sold(p) ? '' : 'I would like information about apartment ' + u.n + ' in ' + p.name + '.');
    reset();
  }
  function step(d) { var n = st.p.units.length; st.i = (st.i + d + n) % n; show(); }
  function openPlan(id, i, opener) {
    st.p = T.project(id); st.i = i; st.opener = opener;
    show();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    document.documentElement.classList.add('pv-open');
    stage.focus();
  }
  function closePlan() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('pv-open');
    if (st.opener && document.contains(st.opener)) st.opener.focus();
  });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) return closePlan();
    var z = e.target.closest('[data-pv-zoom]'); if (z) return zoom(+z.getAttribute('data-pv-zoom'));
    if (e.target.closest('[data-pv-reset]')) return reset();
    var s = e.target.closest('[data-pv-step]'); if (s) return step(+s.getAttribute('data-pv-step'));
    if (e.target.closest('[data-pv-close]')) return closePlan();
    if (e.target.closest('[data-pv-cta]')) {
      var m = e.target.closest('[data-pv-cta]').getAttribute('data-msg');
      if (m && !$('#message').value) $('#message').value = m;
      closePlan();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (!dlg.open || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k === '+' || k === '=') { zoom(1); e.preventDefault(); }
    else if (k === '-' || k === '_') { zoom(-1); e.preventDefault(); }
    else if (k === '0') { reset(); e.preventDefault(); }
    else if (/^Arrow/.test(k)) {
      if (st.z > 0) {
        var d = 48;
        if (k === 'ArrowLeft') st.x += d; else if (k === 'ArrowRight') st.x -= d;
        else if (k === 'ArrowUp') st.y += d; else st.y -= d;
        apply(); e.preventDefault();
      } else if (k === 'ArrowLeft' || k === 'ArrowRight') { step(k === 'ArrowLeft' ? -1 : 1); e.preventDefault(); }
    }
  });
  /* drag to pan */
  var drag = null;
  stage.addEventListener('pointerdown', function (e) {
    if (st.z === 0) return;
    drag = { x: e.clientX - st.x, y: e.clientY - st.y };
    stage.setPointerCapture(e.pointerId); stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', function (e) {
    if (!drag) return;
    st.x = e.clientX - drag.x; st.y = e.clientY - drag.y; apply();
  });
  function endDrag() { drag = null; stage.classList.remove('is-dragging'); }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('wheel', function (e) { e.preventDefault(); zoom(e.deltaY < 0 ? 1 : -1); }, { passive: false });
  stage.addEventListener('dblclick', function () { if (st.z === STEPS.length - 1) reset(); else zoom(1); });
  window.addEventListener('resize', function () { if (dlg.open) apply(); });

  /* ---------- process ---------- */
  $('[data-phases]').innerHTML = T.process.map(function (s, i) {
    return '<li class="phase rv"><p class="phase__n" aria-hidden="true">' + pad(i + 1) + '</p>' +
      '<p class="phase__k">Phase ' + pad(i + 1) + ' — ' + esc(s.step) + '</p>' +
      '<h3 class="phase__h">' + esc(s.title) + '</h3><p class="phase__t">' + esc(s.text) + '</p></li>';
  }).join('');

  /* ---------- services ---------- */
  $('[data-services]').innerHTML = T.services.map(function (s, i) {
    return '<li class="svc rv" style="--i:' + (i % 4) + '"><span class="svc__ico" style="--ico:url(../../images/icons/' + s.icon + ')" aria-hidden="true"></span>' +
      '<p class="svc__g"><span>' + pad(i + 1) + '</span>' + esc(s.group) + '</p>' +
      '<h3 class="svc__h">' + esc(s.title) + '</h3><p class="svc__t">' + esc(s.text) + '</p></li>';
  }).join('');

  /* ---------- interest prefill ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (!a) return;
    var sel = $('#interest'), v = a.getAttribute('data-interest');
    if (!$$('option', sel).some(function (o) { return o.value === v; })) { var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); }
    sel.value = v;
  });

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window && !T.reducedMotion()) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('is-in'); });
  }
  $('[data-year]').textContent = new Date().getFullYear();
})();
