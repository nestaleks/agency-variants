/* Concept A — Catálogo Vivo: rendering from shared data + interactions */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;

  /* ---- header: solid on scroll + mobile menu ---- */
  var hdr = $('[data-hdr]');
  function onScroll() { hdr.classList.toggle('is-solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var navBtn = $('[data-nav-btn]'), navList = $('[data-nav-list]');
  function setMenu(open) {
    navBtn.setAttribute('aria-expanded', String(open));
    navList.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  navBtn.addEventListener('click', function () { setMenu(navBtn.getAttribute('aria-expanded') !== 'true'); });
  navList.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && navList.classList.contains('is-open')) { setMenu(false); navBtn.focus(); } });

  /* ---- facts (derived from data, not invented) ---- */
  var sold = T.projects.filter(function (p) { return p.status === 'sold'; }).length;
  var facts = [['2018', 'Founded'], [String(T.projects.length), 'Developments'], [String(sold), 'Completed & sold'], [String(T.projects.length - sold), 'In progress']];
  $('[data-facts]').innerHTML = facts.map(function (f) { return '<div><dt>' + f[1] + '</dt><dd>' + f[0] + '</dd></div>'; }).join('');

  /* ---- portfolio chapters ---- */
  var order = ['solivar', 'boho-corner', 'can-marques', 'foners-club', 'marina-residence'];  // catalog order
  $('[data-chapters]').innerHTML = order.map(function (id, i) {
    var p = T.project(id);
    var thumbs = p.gallery.slice(0, 4).map(function (g, j) {
      return '<button type="button" aria-pressed="' + (j === 0) + '" data-src="' + T.img(g) + '" aria-label="Show photo ' + (j + 1) + ' of ' + esc(p.name) + '"><img src="' + T.img(g) + '" alt="" loading="lazy" width="72" height="52"></button>';
    }).join('');
    return '' +
      '<article class="chapter" data-status="' + p.status + '" aria-labelledby="ch-' + p.id + '">' +
        '<header class="chapter__open wrap reveal"><p class="chapter__kicker">Portfolio of projects<span class="chapter__place">' + esc(p.area) + '</span></p></header>' +
        '<div class="wrap chapter__grid">' +
          '<div class="chapter__media reveal">' +
            '<div class="chapter__frame"><img src="' + T.img(p.gallery[0]) + '" alt="' + esc(p.name) + ', ' + esc(p.area) + '" loading="lazy" width="1920" height="1080"></div>' +
            '<span class="chapter__corner" aria-hidden="true"></span>' +
            '<div class="thumbs" role="group" aria-label="' + esc(p.name) + ' photos">' + thumbs + '</div>' +
          '</div>' +
          '<div class="chapter__copy reveal">' +
            '<p class="status' + (p.status === 'sold' ? ' status--sold' : '') + '">' + p.statusLabel + '</p>' +
            '<h3 class="chapter__name" id="ch-' + p.id + '">' + esc(p.name) + '</h3>' +
            '<p class="chapter__lead">' + esc(p.headline) + '</p>' +
            '<p class="chapter__text">' + esc(p.summary) + '</p>' +
            '<dl class="chapter__facts">' + p.facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('') + '</dl>' +
            '<ul class="amen" aria-label="Amenities">' + p.amenities.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul>' +
            '<div class="chapter__actions">' +
              '<button type="button" class="btn btn--green" data-open-units="' + p.id + '">View ' + p.units.length + ' apartments</button>' +
              (p.status === 'sold'
                ? '<a class="btn btn--line" href="#contact" data-interest="Similar property to ' + esc(p.name) + '">Ask about similar homes</a>'
                : '<a class="btn btn--line" href="#contact" data-interest="' + esc(p.name) + '">Request availability</a>') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }).join('');

  // thumbnail → main image crossfade
  $$('.thumbs').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var img = $('.chapter__frame img', group.parentNode);
      $$('button', group).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      img.classList.add('is-out');
      setTimeout(function () { img.src = b.getAttribute('data-src'); img.onload = function () { img.classList.remove('is-out'); }; }, T.reducedMotion() ? 0 : 280);
    });
  });

  // filter
  $$('[data-filter]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      $$('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.chapter').forEach(function (c) { c.hidden = f !== 'all' && c.getAttribute('data-status') !== f; });
    });
  });

  /* ---- approach steps ---- */
  $('[data-steps]').innerHTML = T.process.map(function (s, i) {
    return '<li class="step reveal"><span class="step__n" aria-hidden="true">' + (i + 1) + '</span><p class="step__k">' + s.step + '</p><h3 class="step__t">' + s.title + '</h3><p>' + s.text + '</p></li>';
  }).join('');
  var steps = $('[data-steps]');
  function stepProgress() {
    var r = steps.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.width ? vh * 0.6 : 1)));
    steps.style.setProperty('--progress', Math.round(p * 100) + '%');
  }
  window.addEventListener('scroll', stepProgress, { passive: true }); stepProgress();

  /* ---- services (details/summary accordions) ---- */
  var groups = {};
  T.services.forEach(function (s) { (groups[s.group] = groups[s.group] || []).push(s); });
  $('[data-services]').innerHTML = Object.keys(groups).map(function (g) {
    return '<div class="sgroup reveal"><h3 class="sgroup__t">' + g + '</h3>' + groups[g].map(function (s, i) {
      return '<details class="svc"' + (i === 0 && g === 'Build' ? ' open' : '') + '><summary>' + s.title + '</summary><p>' + s.text + '</p></details>';
    }).join('') + '</div>';
  }).join('');

  /* ---- units dialog ---- */
  var dlg = $('[data-units]'), lastFocus = null;
  function openUnits(id) {
    var p = T.project(id);
    $('[data-units-title]').textContent = p.name;
    $('[data-units-area]').textContent = p.area + ' · ' + p.statusLabel;
    var rows = p.units.map(function (u) {
      var o = T.outdoor(u);
      return '<tr><td>Apartment ' + u.n + (u.duplex ? ' <small>(two levels)</small>' : '') + '</td>' +
        '<td data-l="Area">' + T.fmtArea(u.area) + '</td><td data-l="Bedrooms">' + u.beds + '</td><td data-l="Bathrooms">' + u.baths + '</td>' +
        '<td data-l="' + (o ? o.label : 'Outdoor') + '">' + (o ? (o.label + ' ' + T.fmtArea(o.value)) : '—') + '</td>' +
        '<td><button type="button" class="plan-b" aria-expanded="false" data-plan="' + T.img(u.plan) + '" data-n="' + u.n + '">Floor plan</button></td></tr>' +
        '<tr class="uplan-row" hidden><td colspan="6" class="uplan"></td></tr>';
    }).join('');
    $('[data-units-body]').innerHTML =
      '<table class="utable"><caption>' + p.units.length + ' apartments · areas as published by TID group</caption>' +
      '<thead><tr><th scope="col">Unit</th><th scope="col">Area</th><th scope="col">Beds</th><th scope="col">Baths</th><th scope="col">Outdoor</th><th scope="col"><span class="sr">Plan</span></th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="units__note">' + (p.status === 'sold' ? 'All apartments in this building have been sold.' : 'Prices and current availability on request — <a href="#contact" data-close-to-contact data-interest="' + esc(p.name) + '">send an enquiry</a>.') + '</p>';
    lastFocus = document.activeElement;
    dlg.showModal();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open-units]');
    if (b) openUnits(b.getAttribute('data-open-units'));
    var pb = e.target.closest('.plan-b');
    if (pb) {
      var row = pb.closest('tr').nextElementSibling, open = pb.getAttribute('aria-expanded') === 'true';
      if (!open && !row.querySelector('img')) row.firstChild.innerHTML = '<img src="' + pb.getAttribute('data-plan') + '" alt="Floor plan of apartment ' + pb.getAttribute('data-n') + '" loading="lazy">';
      row.hidden = open; pb.setAttribute('aria-expanded', String(!open));
    }
    var interest = e.target.closest('[data-interest]');
    if (interest) {
      var sel = $('#interest'), v = interest.getAttribute('data-interest');
      if (sel) { if (!$$('option', sel).some(function (o) { return o.value === v; })) { var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); } sel.value = v; }
      if (dlg.open) dlg.close();
    }
  });
  $('[data-units-close]').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); });

  /* ---- active nav link ---- */
  var links = $$('.nav__list a[href^="#"]:not(.btn)');
  var secs = links.map(function (a) { return $(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) navIO.observe(s); });

    /* ---- reveal on scroll ---- */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  $('[data-year]').textContent = new Date().getFullYear();
})();
