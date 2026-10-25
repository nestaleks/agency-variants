/* Concept L — Agua: water caustics hero, render/plan reveal sliders, depth gauge, project dialogs with bedroom filter */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc, RM = T.reducedMotion();
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ---------- header + mobile menu ---------- */
  var hd = $('[data-hd]'), menu = $('[data-menu]'), nav = $('[data-nav]'), menuLabel = $('[data-menu-label]');
  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    hd.classList.toggle('is-open', open);
    menuLabel.textContent = open ? 'Close' : 'Menu';
  }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menu.focus(); }
  });

  /* ---------- per-project water / outdoor chips (only facts from data.js) ---------- */
  var WATER = {
    'marina-residence': [['water', '30 m to El Arenal beach'], ['water', 'Jacuzzi'], ['', 'Rooftop terrace'], ['', 'Panoramic views']],
    'foners-club': [['water', 'Pool'], ['water', '10 min walk to the beach'], ['', 'Commercial premises']],
    'can-marques': [['water', 'Pool'], ['', 'Relaxation area']],
    'solivar': [['water', 'Private pool'], ['water', 'In the port of Sóller'], ['', 'Gardens up to 160 m²']],
    'boho-corner': [['water', 'Steps from the Paseo Marítimo'], ['', 'Roof terraces up to 107 m²']]
  };
  /* photo used for the render/plan comparison: chosen so pool or sea is visible, matched to the first plan */
  var REVEAL_PHOTO = {
    'marina-residence': ['projects/marina-residence/marina-residence-gallery-01.jpg', 'Marina Residence render: the five-storey building on the corner, with the sea and El Arenal beach beyond'],
    'foners-club': ['projects/foners-club/foners-club-gallery-04.jpg', 'Foners Club render from above: the rectangular pool and loungers on a timber deck beside the building'],
    'can-marques': ['projects/can-marques/can-marques-gallery-01.jpg', 'Can Marquès render: pool and loungers at the foot of the building, with timber-slatted balconies'],
    'solivar': ['projects/solivar/solivar-gallery-01.jpg', 'S’Olivar from above: tiled roof, gardens and the curved private pool'],
    'boho-corner': ['projects/boho-corner/boho-corner-gallery-01.jpg', 'Boho Corner: two-storey corner building with stone cladding and timber shutters in El Terreno']
  };
  function chips(id) {
    return (WATER[id] || []).map(function (c) {
      return '<li class="chip' + (c[0] ? ' chip--water' : '') + '">' + (c[0] ? '<span class="chip__drop" aria-hidden="true"></span>' : '') + esc(c[1]) + '</li>';
    }).join('');
  }

  /* ---------- pillars ---------- */
  $('[data-pillars]').innerHTML = T.company.pillars.map(function (p, i) {
    return '<li class="q"><span class="pillars__n">' + pad(i + 1) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></li>';
  }).join('');

  /* ---------- projects ---------- */
  var order = ['marina-residence', 'foners-club', 'can-marques', 'solivar', 'boho-corner'];
  $('[data-projects]').innerHTML = order.map(function (id, i) {
    var p = T.project(id), sold = p.status === 'sold', ph = REVEAL_PHOTO[id];
    return '<article class="pcard glass q' + (i % 2 ? ' pcard--flip' : '') + '" id="p-' + id + '" aria-labelledby="pt-' + id + '">' +
      '<div class="reveal" data-reveal style="--pos:30%">' +
        '<img class="reveal__photo" src="' + T.img(ph[0]) + '" alt="' + esc(ph[1]) + '" width="1920" height="1080" loading="lazy">' +
        '<div class="reveal__plan"><img src="' + T.img(p.plans[0]) + '" alt="Architectural plan of ' + esc(p.name) + '" width="1920" height="1080" loading="lazy"></div>' +
        '<span class="reveal__line" aria-hidden="true"><span class="reveal__knob"></span></span>' +
        '<span class="reveal__tag reveal__tag--plan" aria-hidden="true">Plan</span><span class="reveal__tag reveal__tag--render" aria-hidden="true">Render</span>' +
        '<input class="reveal__range" type="range" min="0" max="100" step="1" value="30" aria-label="Reveal the plan of ' + esc(p.name) + '" aria-valuetext="Plan 30%, render 70%">' +
      '</div>' +
      '<div class="pcard__info">' +
        '<p class="pcard__top"><span class="pcard__n">' + pad(i + 1) + '</span><span class="status' + (sold ? ' status--sold' : '') + '">' + (sold ? 'Completed · Sold' : 'In progress') + '</span></p>' +
        '<h3 class="pcard__name" id="pt-' + id + '">' + esc(p.name) + '</h3>' +
        '<p class="pcard__loc">' + esc(p.area) + ' · ' + esc(p.city) + '</p>' +
        '<p class="pcard__head">' + esc(p.headline) + ' <span lang="es">— ' + esc(p.headlineEs) + '</span></p>' +
        '<p class="pcard__sum">' + esc(p.summary) + '</p>' +
        '<ul class="chips" aria-label="Water and outdoor features">' + chips(id) + '</ul>' +
        '<dl class="facts">' + p.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="pcard__actions">' +
          '<button class="btn btn--deep" type="button" data-open="' + id + '">Explore ' + p.units.length + ' homes</button>' +
          '<a class="btn btn--ghost" href="#contact" data-interest="' + esc(sold ? 'Homes similar to ' + p.name : p.name) + '">' + (sold ? 'Ask about similar homes' : 'Request availability') + '</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('');

  /* ---------- render / plan reveal ---------- */
  function setReveal(r, v) {
    v = Math.max(0, Math.min(100, Math.round(v)));
    var input = $('.reveal__range', r);
    r.style.setProperty('--pos', v + '%');
    input.value = v;
    input.setAttribute('aria-valuetext', 'Plan ' + v + '%, render ' + (100 - v) + '%');
    r.classList.toggle('is-plan', v > 50);
  }
  $$('[data-reveal]').forEach(function (r) {
    var input = $('.reveal__range', r), dragging = false, nudged = false;
    input.addEventListener('input', function () { setReveal(r, +input.value); });
    function fromX(x) { var b = r.getBoundingClientRect(); setReveal(r, (x - b.left) / b.width * 100); }
    r.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true; nudged = true; r.classList.add('is-drag');
      try { r.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      fromX(e.clientX);
    });
    r.addEventListener('pointermove', function (e) { if (dragging) fromX(e.clientX); });
    function end() { dragging = false; r.classList.remove('is-drag'); }
    r.addEventListener('pointerup', end);
    r.addEventListener('pointercancel', end);
    /* a gentle one-time nudge so the reveal is discoverable (skipped under reduced motion) */
    if (!RM && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting || nudged) return;
        io.disconnect(); nudged = true;
        var t0 = performance.now();
        (function step(t) {
          if (dragging) return;
          var k = Math.min(1, (t - t0) / 1600), v = 30 + Math.sin(k * Math.PI) * 24;
          setReveal(r, v);
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      }, { threshold: 0.6 });
      io.observe(r);
    }
  });

  /* ---------- services ---------- */
  var GROUPS = [
    { name: 'Build', note: 'From the plot to a finished building.', cta: ['Discuss a custom build', 'Custom construction'] },
    { name: 'Buy & sell', note: 'Secure transactions in both directions.', cta: ['Sell your property with us', 'Selling my property'] },
    { name: 'Advise', note: 'Legal, process and financial support.', cta: ['Book a consultation', 'Investment consultation'] }
  ];
  $('[data-services]').innerHTML = GROUPS.map(function (g) {
    var list = T.services.filter(function (s) { return s.group === g.name; });
    return '<div class="sgroup glass q"><div class="sgroup__head"><h3>' + esc(g.name) + '</h3><p>' + esc(g.note) + '</p><span class="sgroup__count" aria-hidden="true">' + pad(list.length) + '</span></div>' +
      '<ul class="tiles">' + list.map(function (s) {
        return '<li class="tile"><span class="tile__ico" aria-hidden="true" style="--ico:url(../../images/icons/' + s.icon + ')"></span><h4>' + esc(s.title) + '</h4><p>' + esc(s.text) + '</p></li>';
      }).join('') + '</ul>' +
      '<a class="sgroup__cta" href="#contact" data-interest="' + esc(g.cta[1]) + '">' + esc(g.cta[0]) + '<span aria-hidden="true"> →</span></a></div>';
  }).join('');

  /* ---------- process: depth markers ---------- */
  $('[data-process]').innerHTML = T.process.map(function (s, i) {
    return '<li class="marker q"><span class="marker__ring" aria-hidden="true"><span>' + pad(i + 1) + '</span></span>' +
      '<p class="marker__step">' + (i === 0 ? 'Surface · ' : i === T.process.length - 1 ? 'Depth · ' : '') + esc(s.step) + '</p>' +
      '<h3>' + esc(s.title) + '</h3><p class="marker__text">' + esc(s.text) + '</p></li>';
  }).join('');

  /* ---------- interest prefill ---------- */
  var sel = $('#interest');
  function prefill(v, msg) {
    if (!$$('option', sel).some(function (o) { return o.value === v; })) {
      var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o);
    }
    sel.value = v;
    if (msg) { var m = $('#message'); if (!m.value) m.value = msg; }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (!a) return;
    prefill(a.getAttribute('data-interest'), a.getAttribute('data-message'));
  });

  /* ---------- project dialog ---------- */
  var dlg = $('[data-pd]'), opener = null, cur = null;
  var dImg = $('[data-pd-img]'), dCap = $('[data-pd-cap]');
  function showMedia(src, alt, cap) { dImg.src = T.img(src); dImg.alt = alt; dCap.textContent = cap; }
  function media(p) {
    return p.gallery.map(function (g, i) { return { src: g, alt: p.name + ' — image ' + (i + 1), label: 'Photo ' + (i + 1), cap: p.name + ' · photo ' + (i + 1) + ' of ' + p.gallery.length }; })
      .concat(p.plans.map(function (g, i) { return { src: g, alt: 'Architectural plan of ' + p.name + ' (' + (i + 1) + ')', label: 'Plan ' + (i + 1), cap: p.name + ' · plan ' + (i + 1), plan: true }; }));
  }
  function pressThumb(i) { $$('[data-thumb]', dlg).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-thumb') === i)); }); }
  function filterUnits(beds) {
    var lis = $$('[data-pd-units] li'), shown = 0;
    lis.forEach(function (li) { var v = beds === 'all' || li.getAttribute('data-beds') === beds; li.hidden = !v; if (v) shown++; });
    $$('[data-beds-btn]', dlg).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-beds-btn') === beds)); });
    $('[data-pd-count]').textContent = 'Showing ' + shown + ' of ' + lis.length + ' homes';
  }
  function openProject(id, from) {
    var p = T.project(id), sold = p.status === 'sold', m = media(p);
    cur = p; opener = from || null;
    $('[data-pd-meta]').textContent = p.area + ' · ' + p.city + ' · ' + (sold ? 'Completed · Sold' : 'In progress');
    $('[data-pd-title]').textContent = p.name;
    $('[data-pd-chips]').innerHTML = chips(id);
    $('[data-pd-thumbs]').innerHTML = m.map(function (x, i) {
      return '<button type="button" class="thumb' + (x.plan ? ' thumb--plan' : '') + '" data-thumb="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="' + esc(x.label) + '"><img src="' + T.img(x.src) + '" alt="" width="160" height="90" loading="lazy"></button>';
    }).join('');
    showMedia(m[0].src, m[0].alt, m[0].cap);
    var beds = p.units.map(function (u) { return u.beds; }).filter(function (b, i, a) { return a.indexOf(b) === i; }).sort();
    $('[data-pd-filter]').innerHTML = '<button type="button" data-beds-btn="all" aria-pressed="true">All</button>' +
      beds.map(function (b) { return '<button type="button" data-beds-btn="' + b + '" aria-pressed="false">' + b + ' bed' + (b > 1 ? 's' : '') + '</button>'; }).join('');
    $('[data-pd-units]').innerHTML = p.units.map(function (u) {
      var o = T.outdoor(u);
      return '<li class="unit" data-beds="' + u.beds + '">' +
        '<span class="unit__n">Apt ' + pad(u.n) + '</span>' +
        '<span class="unit__spec">' + T.fmtArea(u.area) + ' · ' + u.beds + ' bed · ' + u.baths + ' bath' + (o ? ' · ' + o.label.toLowerCase() + ' ' + T.fmtArea(o.value) : '') + (u.duplex ? ' · duplex' : '') + '</span>' +
        '<span class="unit__price' + (sold ? ' is-sold' : '') + '">' + (sold ? 'Sold' : 'Price on request') + '</span>' +
        '<span class="unit__act"><button type="button" class="ubtn" data-unit-plan="' + u.n + '" aria-label="Floor plan of apartment ' + u.n + '">Plan</button>' +
        (sold ? '' : '<a class="ubtn ubtn--deep" href="#contact" data-leave data-interest="' + esc(p.name) + '" data-message="' + esc('I would like details and the price of apartment ' + u.n + ' at ' + p.name + '.') + '" aria-label="Enquire about apartment ' + u.n + '">Enquire</a>') +
        '</span></li>';
    }).join('');
    filterUnits('all');
    var cta = $('[data-pd-cta]');
    cta.textContent = sold ? 'Ask about similar homes' : 'Request availability at ' + p.name;
    cta.setAttribute('data-interest', sold ? 'Homes similar to ' + p.name : p.name);
    $('.pd__units', dlg).scrollTop = 0;
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    document.documentElement.classList.add('has-dialog');
  }
  function closeProject() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('has-dialog');
    if (opener && document.contains(opener)) opener.focus();
  });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) { closeProject(); return; }
    if (e.target.closest('[data-pd-close]')) { closeProject(); return; }
    var t = e.target.closest('[data-thumb]');
    if (t) { var i = +t.getAttribute('data-thumb'), x = media(cur)[i]; showMedia(x.src, x.alt, x.cap); pressThumb(i); return; }
    var b = e.target.closest('[data-beds-btn]');
    if (b) { filterUnits(b.getAttribute('data-beds-btn')); return; }
    var up = e.target.closest('[data-unit-plan]');
    if (up) {
      var n = +up.getAttribute('data-unit-plan'), u = cur.units.filter(function (x) { return x.n === n; })[0];
      showMedia(u.plan, 'Floor plan of apartment ' + n + ' at ' + cur.name, cur.name + ' · apartment ' + pad(n) + ' · floor plan');
      pressThumb(-1);
      if (window.matchMedia('(max-width: 900px)').matches) $('.pd__fig', dlg).scrollIntoView({ block: 'start', behavior: RM ? 'auto' : 'smooth' });
      return;
    }
    var leave = e.target.closest('[data-leave], [data-pd-cta]');
    if (leave) {
      e.preventDefault();
      opener = null; closeProject();
      $('#contact').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      setTimeout(function () { $('#name').focus({ preventScroll: true }); }, RM ? 0 : 450);
    }
  });
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]'); if (o) openProject(o.getAttribute('data-open'), o);
  });

  /* ---------- water caustics (canvas, low-res, paused off-screen / on demand / under reduced motion) ---------- */
  (function () {
    var cv = $('[data-caustics]'), btn = $('[data-caustics-btn]'), label = $('[data-caustics-label]');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), W = 160, H = 90, img, data, visible = true, userPaused = false, raf = 0, last = 0, t = 23;
    function size() {
      var b = cv.getBoundingClientRect();
      W = 160; H = Math.max(40, Math.round(160 * (b.height || 90) / (b.width || 160)));
      cv.width = W; cv.height = H; img = ctx.createImageData(W, H); data = img.data;
    }
    function frame(time) {
      var TAU = 6.28318530718, inten = 0.005, k = 0, sx = TAU * 1.6, sy = TAU * 1.6 * H / W;
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var px = x / W * sx - 250, py = y / H * sy - 250, ix = px, iy = py, c = 1;
          for (var n = 0; n < 4; n++) {
            var tt = time * (1 - 3.5 / (n + 1));
            var nx = px + Math.cos(tt - ix) + Math.sin(tt + iy);
            var ny = py + Math.sin(tt - iy) + Math.cos(tt + ix);
            ix = nx; iy = ny;
            c += 1 / Math.sqrt(Math.pow(px / (Math.sin(ix + tt) / inten), 2) + Math.pow(py / (Math.cos(iy + tt) / inten), 2));
          }
          c = 1.17 - Math.pow(c / 4, 1.4);
          var v = Math.pow(Math.abs(c), 7);
          data[k] = 232; data[k + 1] = 252; data[k + 2] = 255; data[k + 3] = v > 1 ? 255 : v * 255;
          k += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
    }
    function loop(now) {
      raf = 0;
      if (!visible || userPaused || document.hidden) return;
      if (now - last > 40) { t += (now - last > 200 ? 0.04 : (now - last) / 1000 * 0.45); last = now; frame(t); }
      raf = requestAnimationFrame(loop);
    }
    function play() { if (!raf && !RM) { last = performance.now(); raf = requestAnimationFrame(loop); } }
    size(); frame(t);
    window.addEventListener('resize', function () { size(); frame(t); });
    if (RM) return; /* static single frame */
    btn.hidden = false;
    btn.addEventListener('click', function () {
      userPaused = !userPaused;
      btn.setAttribute('aria-pressed', String(userPaused));
      label.textContent = userPaused ? 'Play water light' : 'Pause water light';
      if (!userPaused) play();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) play(); }).observe(cv);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) play(); });
    play();
  })();

  /* ---------- depth: --depth custom property follows scroll; gauge + sunlight read it ---------- */
  var root = document.documentElement, gaugeLinks = $$('[data-gauge] a');
  var secs = gaugeLinks.map(function (a) { return $(a.getAttribute('href')); });
  var ticking = false;
  function depth() {
    ticking = false;
    var max = Math.max(1, root.scrollHeight - innerHeight), d = Math.min(1, Math.max(0, scrollY / max));
    var probe = innerHeight * 0.4, idx = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= probe) idx = i; });
    if (scrollY >= max - 2) idx = secs.length - 1;
    if (RM) d = idx / (secs.length - 1); /* fixed steps */
    root.style.setProperty('--depth', d.toFixed(3));
    hd.classList.toggle('is-scrolled', scrollY > 24);
    var under = 0;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= 36) under = i; });
    hd.classList.toggle('is-deep', under >= 3);
    gaugeLinks.forEach(function (a, i) { if (i === idx) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(depth); } }, { passive: true });
  window.addEventListener('resize', depth);
  depth();

  /* ---------- quiet reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !RM) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.q, .sh, .process__intro, .inv, .contact__intro, .form').forEach(function (el) { el.classList.add('q'); rio.observe(el); });
  } else {
    $$('.q').forEach(function (el) { el.classList.add('is-in'); });
  }

  $('[data-year]').textContent = new Date().getFullYear();
})();
