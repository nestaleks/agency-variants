/* Concept H — Nocturno: showreel hero, residences as full-screen scenes, homes dialog, cinematic lightbox,
   letterbox bars that close in on scroll, credits-roll services. All content from shared/data.js. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;
  var reduced = T.reducedMotion();
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  /* Image choices + descriptive alt text (images are real renders/photos from the site) */
  var REEL = {
    'marina-residence': 'projects/marina-residence/marina-residence-gallery-01.jpg',
    'foners-club': 'projects/foners-club/foners-club-gallery-05.jpg',
    'can-marques': 'projects/can-marques/can-marques-gallery-01.jpg',
    'solivar': 'projects/solivar/solivar-gallery-02.jpg',
    'boho-corner': 'projects/boho-corner/boho-corner-gallery-06.jpg'
  };
  var SCENE = {
    'marina-residence': 'projects/marina-residence/marina-residence-gallery-03.jpg',
    'foners-club': 'projects/foners-club/foners-club-gallery-01.jpg',
    'can-marques': 'projects/can-marques/can-marques-gallery-03.jpg',
    'solivar': 'projects/solivar/solivar-gallery-01.jpg',
    'boho-corner': 'projects/boho-corner/boho-corner-gallery-01.jpg'
  };
  var ALT = {
    'marina-residence-gallery-01': 'Aerial view of Marina Residence on a street corner, with the bay of Palma beyond',
    'marina-residence-gallery-02': 'Marina Residence roof terrace looking out over the sea',
    'marina-residence-gallery-03': 'Marina Residence from the street corner: terraces, palms and the sea at the end of the road',
    'marina-residence-gallery-04': 'Street view of the Marina Residence façade with its balconies',
    'foners-club-gallery-01': 'Foners Club street façade with commercial premises on the ground floor',
    'foners-club-gallery-02': 'Foners Club façade with timber panels and glass balconies',
    'foners-club-gallery-03': 'Aerial view of the planted roof terrace at Foners Club',
    'foners-club-gallery-04': 'Aerial view of the Foners Club pool courtyard',
    'foners-club-gallery-05': 'Foners Club pool deck with sun loungers',
    'can-marques-gallery-01': 'Courtyard pool beneath the Can Marquès façade',
    'can-marques-gallery-02': 'Can Marquès façade with vertical timber slats',
    'can-marques-gallery-03': 'Front elevation of Can Marquès with terraces and planting',
    'can-marques-gallery-04': 'Aerial view of the Can Marquès terraces',
    'can-marques-gallery-06': 'Detail of the Can Marquès façade with timber louvres',
    'can-marques-gallery-07': 'Can Marquès seen from the street at ground level',
    'solivar-gallery-01': 'Aerial view of S’Olivar: tiled roofs, private gardens and the pool',
    'solivar-gallery-02': 'S’Olivar garden pool in front of the building',
    'solivar-gallery-04': 'S’Olivar living room with garden views',
    'solivar-gallery-05': 'Double-height S’Olivar living room opening onto the garden',
    'solivar-gallery-06': 'S’Olivar staircase with glass balustrade',
    'solivar-gallery-07': 'S’Olivar open kitchen and dining area',
    'boho-corner-gallery-01': 'Boho Corner corner façade in stone with timber shutters, El Terreno',
    'boho-corner-gallery-02': 'Boho Corner roof terrace with dining table and lounge',
    'boho-corner-gallery-03': 'Boho Corner living room with a dark spiral staircase',
    'boho-corner-gallery-06': 'Boho Corner roof terrace with sun loungers above the city',
    'boho-corner-gallery-07': 'Boho Corner living and dining room in warm light',
    'boho-corner-gallery-08': 'Boho Corner living room with parquet floor'
  };
  function altFor(path, p) {
    var k = path.split('/').pop().replace(/\.\w+$/, '');
    return ALT[k] || p.name + ', ' + p.area;
  }

  /* ---------- header + mobile menu ---------- */
  var top = $('[data-top]'), menu = $('[data-menu]'), nav = $('[data-nav]');
  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    $('[data-menu-label]').textContent = open ? 'Close' : 'Menu';
  }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menu.focus(); }
  });

  /* ---------- showreel ---------- */
  var reel = $('#reel'), frames = $('[data-frames]'), ticks = $('[data-ticks]'), play = $('[data-play]');
  var cur = 0, playing = !reduced;
  frames.innerHTML = T.projects.map(function (p, i) {
    return '<div class="frame' + (i === 0 ? ' is-on' : '') + '" style="--o:' + ['30% 60%', '70% 40%', '50% 70%', '35% 35%', '65% 55%'][i] + '">' +
      '<img src="' + T.img(REEL[p.id]) + '" alt="" width="1920" height="1080"' + (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + '></div>';
  }).join('');
  ticks.innerHTML = T.projects.map(function (p, i) {
    return '<li><button type="button" class="tick" data-tick="' + i + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' +
      '<span class="sr">Show ' + esc(p.name) + '</span><span class="tick__n" aria-hidden="true">' + pad2(i + 1) + '</span>' +
      '<span class="tick__bar" aria-hidden="true"><span class="tick__fill"></span></span></button></li>';
  }).join('');
  var frameEls = $$('.frame', frames), tickEls = $$('.tick', ticks);

  function show(i) {
    cur = (i + frameEls.length) % frameEls.length;
    var p = T.projects[cur];
    frameEls.forEach(function (f, k) { f.classList.toggle('is-on', k === cur); });
    tickEls.forEach(function (t, k) {
      t.classList.remove('is-on');
      if (k === cur) { t.setAttribute('aria-current', 'true'); void t.offsetWidth; t.classList.add('is-on'); }
      else t.removeAttribute('aria-current');
    });
    var c = $('[data-credit]');
    c.classList.remove('is-in'); void c.offsetWidth;
    $('[data-credit-n]').textContent = pad2(cur + 1);
    $('[data-credit-name]').textContent = p.name;
    $('[data-credit-meta]').textContent = p.area + ' — ' + (p.status === 'sold' ? 'Completed · Sold' : 'In progress');
    c.classList.add('is-in');
  }
  function setPlaying(on) {
    playing = on;
    reel.classList.toggle('is-paused', !on);
    play.setAttribute('aria-label', on ? 'Pause showreel' : 'Play showreel');
    play.setAttribute('data-state', on ? 'playing' : 'paused');
  }
  /* the active tick's fill animation is the timer: it pauses with the reel */
  ticks.addEventListener('animationend', function (e) { if (e.target.classList.contains('tick__fill') && playing) show(cur + 1); });
  ticks.addEventListener('click', function (e) { var b = e.target.closest('[data-tick]'); if (b) show(+b.getAttribute('data-tick')); });
  play.addEventListener('click', function () { setPlaying(!playing); });
  setPlaying(playing);
  show(0);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { reel.classList.toggle('is-offscreen', !es[0].isIntersecting); }).observe(reel);
  }

  /* ---------- prologue pillars ---------- */
  $('[data-pillars]').innerHTML = T.company.pillars.map(function (x, i) {
    return '<li class="rv" style="--d:' + (i * 0.12) + 's"><span class="pillars__n" aria-hidden="true">' + ['i', 'ii', 'iii'][i] + '</span><h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p></li>';
  }).join('');

  /* ---------- residences as scenes ---------- */
  $('[data-scenes]').innerHTML = T.projects.map(function (p, i) {
    var sold = p.status === 'sold';
    var src = SCENE[p.id];
    return '<article class="film scene' + (i % 2 ? ' film--r' : '') + (sold ? ' film--sold' : '') + '" id="film-' + p.id + '" data-scene aria-labelledby="film-' + p.id + '-h">' +
      '<figure class="film__bg"><img src="' + T.img(src) + '" alt="' + esc(altFor(src, p)) + '" width="1920" height="1080" loading="lazy"></figure>' +
      '<div class="bars" aria-hidden="true"><span class="bars__t"></span><span class="bars__b"></span></div>' +
      '<div class="film__in">' +
        '<p class="film__reel rv"><span>Reel ' + pad2(i + 1) + '</span><span class="film__status">' + (sold ? 'Completed · Sold' : 'In progress') + '</span></p>' +
        '<h3 class="film__h rv" id="film-' + p.id + '-h">' + esc(p.name) + '</h3>' +
        '<p class="film__where rv">' + esc(p.area) + ' · ' + esc(p.city) + '</p>' +
        '<p class="film__line rv">' + esc(p.headline) + ' <span lang="es">— ' + esc(p.headlineEs) + '</span></p>' +
        '<p class="film__sum rv">' + esc(p.summary) + '</p>' +
        '<dl class="film__facts rv">' + p.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="film__ctas rv">' +
          '<button class="btn btn--gold" type="button" data-homes-open="' + p.id + '">View homes <span class="btn__n">' + p.units.length + '</span></button>' +
          '<button class="btn btn--ghost" type="button" data-gallery-open="' + p.id + '">Gallery · ' + pad2(p.gallery.length) + ' stills</button>' +
          '<a class="link" href="#enquire" data-interest="' + esc(sold ? 'Homes similar to ' + p.name : p.name) + '">' + (sold ? 'Ask about similar homes' : 'Private viewing') + '</a>' +
        '</div>' +
      '</div></article>';
  }).join('');

  /* ---------- acts ---------- */
  $('[data-acts]').innerHTML = T.process.map(function (s, i) {
    return '<li class="act rv" style="--d:' + (i * 0.12) + 's"><span class="act__n" aria-hidden="true">' + ['I', 'II', 'III', 'IV'][i] + '</span>' +
      '<p class="act__k">Act ' + ['I', 'II', 'III', 'IV'][i] + ' · ' + esc(s.step) + '</p><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>';
  }).join('');

  /* ---------- services as credits ---------- */
  var groups = ['Build', 'Buy & sell', 'Advise'];
  $('[data-credits]').innerHTML = groups.map(function (g, gi) {
    return '<div class="roll"><h3 class="roll__h rv" style="--d:' + (gi * 0.15) + 's">' + esc(g) + '</h3><ul>' +
      T.services.filter(function (s) { return s.group === g; }).map(function (s, i) {
        return '<li class="rv" style="--d:' + (gi * 0.15 + (i + 1) * 0.12) + 's"><span class="roll__t">' + esc(s.title) + '</span><span class="roll__x">' + esc(s.text) + '</span></li>';
      }).join('') + '</ul></div>';
  }).join('');

  /* ---------- interest prefill (any element with data-interest) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (!a) return;
    var sel = $('#interest'), v = a.getAttribute('data-interest');
    if (!$$('option', sel).some(function (o) { return o.value === v; })) { var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); }
    sel.value = v;
    var d = a.closest('dialog'); if (d && d.open) d.close();
  });

  /* ---------- dialogs: shared behaviour ---------- */
  function wireDialog(d) {
    d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
    d.addEventListener('close', function () {
      document.documentElement.classList.toggle('has-dialog', !!$('dialog[open]'));
      if (d._opener && document.contains(d._opener)) d._opener.focus();
    });
  }
  function openDialog(d, opener) { d._opener = opener; d.showModal(); document.documentElement.classList.add('has-dialog'); }

  /* ---------- homes dialog ---------- */
  var homes = $('[data-homes]'); wireDialog(homes);
  var homesProject = null;
  function openHomes(id, opener) {
    var p = T.project(id), sold = p.status === 'sold'; homesProject = p;
    $('[data-homes-name]').textContent = p.name;
    $('[data-homes-meta]').textContent = p.area + ' · ' + p.units.length + ' homes · ' + (sold ? 'Completed · Sold' : 'In progress');
    $('[data-homes-cap]').textContent = 'Homes at ' + p.name;
    $('[data-homes-rows]').innerHTML = p.units.map(function (u, i) {
      var o = T.outdoor(u);
      return '<tr><th scope="row" data-l="Home">No. ' + u.n + (u.duplex ? ' <span class="tag">Duplex</span>' : '') + '</th>' +
        '<td data-l="Interior">' + T.fmtArea(u.area) + '</td><td data-l="Bedrooms">' + u.beds + '</td><td data-l="Bathrooms">' + u.baths + '</td>' +
        '<td data-l="Outdoor">' + (o ? o.label + ' ' + T.fmtArea(o.value) : '—') + '</td>' +
        '<td data-l="Availability" class="' + (sold ? 'is-sold' : 'is-req') + '">' + (sold ? 'Sold' : 'Price on request') + '</td>' +
        '<td class="homes__plan">' + (u.plan ? '<button type="button" class="plan-btn" data-plan="' + i + '" aria-label="Floor plan of home ' + u.n + '">Plan</button>' : '') + '</td></tr>';
    }).join('');
    var cta = $('[data-homes-cta]');
    cta.textContent = sold ? 'Ask about similar homes' : 'Request a private viewing';
    cta.setAttribute('data-interest', sold ? 'Homes similar to ' + p.name : p.name);
    openDialog(homes, opener);
  }
  homes.addEventListener('click', function (e) {
    var b = e.target.closest('[data-plan]'); if (!b) return;
    var p = homesProject;
    var items = p.units.filter(function (u) { return u.plan; }).map(function (u) {
      return { src: T.img(u.plan), alt: 'Floor plan of home ' + u.n + ', ' + p.name + ' — ' + T.fmtArea(u.area) + ', ' + u.beds + ' bedrooms', plan: true };
    });
    openLightbox(items, +b.getAttribute('data-plan'), p.name + ' · Floor plans', b);
  });

  /* ---------- cinematic lightbox ---------- */
  var lbx = $('[data-lbx]'); wireDialog(lbx);
  var lbItems = [], lbI = 0, lbImg = $('[data-lbx-img]');
  function lbShow(i) {
    lbI = (i + lbItems.length) % lbItems.length;
    var it = lbItems[lbI];
    lbImg.classList.remove('is-in');
    lbx.classList.toggle('is-plan', !!it.plan);
    var next = new Image();
    next.onload = next.onerror = function () { lbImg.src = it.src; lbImg.alt = it.alt; void lbImg.offsetWidth; lbImg.classList.add('is-in'); };
    next.src = it.src;
    $('[data-lbx-i]').textContent = pad2(lbI + 1);
    $$('.thumb', lbx).forEach(function (t, k) { if (k === lbI) { t.setAttribute('aria-current', 'true'); t.scrollIntoView({ block: 'nearest', inline: 'center' }); } else t.removeAttribute('aria-current'); });
  }
  function openLightbox(items, start, title, opener) {
    lbItems = items;
    $('[data-lbx-title]').textContent = title;
    $('[data-lbx-name]').textContent = title;
    $('[data-lbx-n]').textContent = pad2(items.length);
    $('[data-lbx-thumbs]').innerHTML = items.map(function (it, k) {
      return '<li><button type="button" class="thumb" data-thumb="' + k + '" aria-label="Image ' + (k + 1) + ' of ' + items.length + '"><img src="' + it.src + '" alt="" loading="lazy"></button></li>';
    }).join('');
    lbImg.removeAttribute('src');
    openDialog(lbx, opener);
    lbShow(start || 0);
  }
  $('[data-lbx-prev]').addEventListener('click', function () { lbShow(lbI - 1); });
  $('[data-lbx-next]').addEventListener('click', function () { lbShow(lbI + 1); });
  $('[data-lbx-thumbs]').addEventListener('click', function (e) { var b = e.target.closest('[data-thumb]'); if (b) lbShow(+b.getAttribute('data-thumb')); });
  lbx.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); lbShow(lbI - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); lbShow(lbI + 1); }
  });
  var sx = null, sy = null, stage = $('[data-lbx-stage]');
  stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) lbShow(lbI + (dx < 0 ? 1 : -1));
  });

  $('[data-scenes]').addEventListener('click', function (e) {
    var h = e.target.closest('[data-homes-open]');
    if (h) return openHomes(h.getAttribute('data-homes-open'), h);
    var g = e.target.closest('[data-gallery-open]');
    if (g) {
      var p = T.project(g.getAttribute('data-gallery-open'));
      openLightbox(p.gallery.map(function (src) { return { src: T.img(src), alt: altFor(src, p) }; }), 0, p.name, g);
    }
  });

  /* ---------- letterbox bars close in as a scene leaves ---------- */
  var scenes = $$('[data-scene]');
  if (!reduced) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight;
      scenes.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var out = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * 0.85)));
        s.style.setProperty('--close', out.toFixed(3));
      });
      top.classList.toggle('is-solid', window.scrollY > vh * 0.6);
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  } else {
    window.addEventListener('scroll', function () { top.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.6); }, { passive: true });
  }

  /* ---------- reveals ---------- */
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('is-in'); });
  }

  $('[data-year]').textContent = new Date().getFullYear();
})();
