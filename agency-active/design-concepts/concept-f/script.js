/* Concept F — Casa de Cal
   Arched doorways open a project "room"; apartments go into a compare tray (max 3) and a side-by-side <dialog>.
   Everything project-related is rendered from shared/data.js (TID). */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;
  var MAX = 3;

  /* ---------- header + mobile menu ---------- */
  var top = $('[data-top]'), menu = $('[data-menu]'), nav = $('[data-nav]'), menuLabel = $('[data-menu-label]');
  window.addEventListener('scroll', function () { top.classList.toggle('is-scrolled', window.scrollY > 12); }, { passive: true });
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

  /* ---------- helpers ---------- */
  function unitKey(p, u) { return p.id + ':' + u.n; }
  function findUnit(key) {
    var parts = key.split(':'), p = T.project(parts[0]);
    if (!p) return null;
    var u = p.units.filter(function (x) { return String(x.n) === parts[1]; })[0];
    return u ? { p: p, u: u } : null;
  }
  function shortName(p) { return p.name.replace(' Residence', '').replace(' Club', ''); }
  function priceLabel(p) { return p.status === 'sold' ? 'Sold' : 'Price on request'; }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

  /* ---------- doorways ---------- */
  var order = ['marina-residence', 'foners-club', 'can-marques', 'solivar', 'boho-corner'];
  var doors = $('[data-doors]'), room = $('[data-room]');
  doors.innerHTML = order.map(function (id, i) {
    var p = T.project(id);
    return '<li><button type="button" class="door" data-door="' + p.id + '" aria-pressed="false" aria-controls="room">' +
      '<span class="door__arch"><img src="' + T.img(p.card) + '" alt="" loading="lazy" width="600" height="800"></span>' +
      '<span class="door__name">' + esc(p.name) + '</span>' +
      '<span class="door__meta">' + esc(p.area) + ' · ' + plural(p.units.length, 'home') + '</span>' +
      '<span class="door__st door__st--' + p.status + '">' + (p.status === 'sold' ? 'Sold' : 'In progress') + '</span>' +
      '<span class="door__num" aria-hidden="true">' + (i + 1) + '</span>' +
      '</button></li>';
  }).join('');

  var current = null, photo = 0;

  function unitCard(p, u) {
    var o = T.outdoor(u), key = unitKey(p, u), inTray = tray.indexOf(key) > -1;
    return '<li class="unit">' +
      '<div class="unit__top"><h4 class="unit__h">Apartment ' + u.n + '</h4>' +
      (u.duplex ? '<span class="chip">Duplex</span>' : '') + '</div>' +
      '<p class="unit__area">' + T.fmtArea(u.area) + '</p>' +
      '<ul class="unit__facts">' +
      '<li>' + plural(u.beds, 'bedroom') + '</li><li>' + plural(u.baths, 'bathroom') + '</li>' +
      (o ? '<li>' + o.label + ' ' + T.fmtArea(o.value) + '</li>' : '') + '</ul>' +
      '<p class="unit__price">' + priceLabel(p) + '</p>' +
      '<div class="unit__acts">' +
      '<button type="button" class="linkbtn" data-plan-open="' + key + '">Floor plan<span class="sr"> of ' + esc(p.name) + ' apartment ' + u.n + '</span></button>' +
      '<button type="button" class="addbtn" data-cmp="' + key + '" aria-pressed="' + inTray + '">' +
      '<span class="addbtn__ico" aria-hidden="true"></span><span data-cmp-label>' + (inTray ? 'In tray' : 'Compare') + '</span>' +
      '<span class="sr"> ' + esc(p.name) + ' apartment ' + u.n + '</span></button>' +
      '</div></li>';
  }

  function renderRoom(id, opts) {
    var p = T.project(id);
    current = p; photo = 0;
    $$('[data-door]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-door') === id)); });
    var sold = p.status === 'sold';
    room.innerHTML =
      '<div class="room__grid">' +
        '<div class="room__media">' +
          '<figure class="room__fig"><img data-room-img src="' + T.img(p.gallery[0]) + '" alt="' + esc(p.name) + ', ' + esc(p.area) + ' — photo 1 of ' + p.gallery.length + '" width="1920" height="1080"></figure>' +
          '<div class="thumbs" role="group" aria-label="Photos of ' + esc(p.name) + '">' +
            p.gallery.map(function (g, i) {
              return '<button type="button" class="thumb" data-photo="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="Photo ' + (i + 1) + ' of ' + p.gallery.length + '"><img src="' + T.img(g) + '" alt="" loading="lazy" width="160" height="120"></button>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="room__info">' +
          '<p class="room__k"><span class="door__st door__st--' + p.status + '">' + esc(p.statusLabel) + '</span> ' + esc(p.area) + ', ' + esc(p.city) + '</p>' +
          '<h3 class="room__h">' + esc(p.name) + '</h3>' +
          '<p class="room__es" lang="es">' + esc(p.headlineEs) + '</p>' +
          '<p class="room__sum">' + esc(p.summary) + '</p>' +
          '<dl class="room__facts">' + p.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
          '<ul class="room__amen" aria-label="Amenities">' + p.amenities.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
          '<a class="btn" href="#hello" data-interest="' + esc(sold ? 'Homes similar to ' + p.name : p.name) + '">' + (sold ? 'Ask about similar homes' : 'Ask about ' + esc(p.name)) + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="units">' +
        '<p class="units__h">' + plural(p.units.length, 'apartment') + ' in ' + esc(p.name) + (sold ? ' — all sold, kept here for reference' : ' — prices on request') + '</p>' +
        '<ul class="units__list">' + p.units.map(function (u) { return unitCard(p, u); }).join('') + '</ul>' +
      '</div>';
    room.classList.remove('is-opening'); void room.offsetWidth; room.classList.add('is-opening');
    if (opts && opts.scroll) {
      var r = room.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.55 || r.top < 0) room.scrollIntoView({ behavior: T.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  doors.addEventListener('click', function (e) {
    var b = e.target.closest('[data-door]'); if (b) renderRoom(b.getAttribute('data-door'), { scroll: true });
  });

  room.addEventListener('click', function (e) {
    var t = e.target.closest('[data-photo]');
    if (t) {
      photo = +t.getAttribute('data-photo');
      var img = $('[data-room-img]', room);
      img.src = T.img(current.gallery[photo]);
      img.alt = current.name + ', ' + current.area + ' — photo ' + (photo + 1) + ' of ' + current.gallery.length;
      $$('[data-photo]', room).forEach(function (x) { x.setAttribute('aria-pressed', String(x === t)); });
      return;
    }
    var c = e.target.closest('[data-cmp]');
    if (c) { toggleTray(c.getAttribute('data-cmp'), c); return; }
    var pl = e.target.closest('[data-plan-open]');
    if (pl) openPlan(pl.getAttribute('data-plan-open'), pl);
  });

  /* ---------- compare tray ---------- */
  var tray = [];
  try { tray = JSON.parse(localStorage.getItem('tidf-compare') || '[]').filter(findUnit).slice(0, MAX); } catch (err) { tray = []; }
  var trayEl = $('[data-tray]'), trayList = $('[data-tray-list]'), trayStatus = $('[data-tray-status]');

  function save() { try { localStorage.setItem('tidf-compare', JSON.stringify(tray)); } catch (err) { /* private mode */ } }
  function announce(msg) { trayStatus.textContent = ''; setTimeout(function () { trayStatus.textContent = msg; }, 30); }

  function syncButtons() {
    $$('[data-cmp]').forEach(function (b) {
      var on = tray.indexOf(b.getAttribute('data-cmp')) > -1;
      b.setAttribute('aria-pressed', String(on));
      $('[data-cmp-label]', b).textContent = on ? 'In tray' : 'Compare';
    });
  }

  function renderTray() {
    trayEl.hidden = tray.length === 0;
    document.body.classList.toggle('has-tray', tray.length > 0);
    $('[data-tray-count]').textContent = tray.length + ' of ' + MAX;
    trayList.innerHTML = tray.map(function (k) {
      var x = findUnit(k);
      return '<li class="tchip"><span class="tchip__arch" style="background-image:url(\'' + T.img(x.p.card) + '\')" aria-hidden="true"></span>' +
        '<span class="tchip__t">' + esc(shortName(x.p)) + ' <b>' + x.u.n + '</b></span>' +
        '<button type="button" class="tchip__x" data-tray-remove="' + k + '" aria-label="Remove ' + esc(x.p.name) + ' apartment ' + x.u.n + ' from the tray">×</button></li>';
    }).join('') + (tray.length < MAX ? '<li class="tchip tchip--empty" aria-hidden="true"><span class="tchip__arch"></span></li>' : '');
    var cmpBtn = $('[data-compare-open]');
    cmpBtn.disabled = tray.length < 2;
    cmpBtn.textContent = tray.length < 2 ? 'Add one more' : 'Compare ' + tray.length;
    syncButtons();
    save();
  }

  function toggleTray(key, btn) {
    var x = findUnit(key), i = tray.indexOf(key), label = x.p.name + ' apartment ' + x.u.n;
    if (i > -1) { tray.splice(i, 1); announce(label + ' removed. ' + tray.length + ' of ' + MAX + ' in the tray.'); }
    else if (tray.length >= MAX) {
      announce('The tray holds three apartments. Remove one to add ' + label + '.');
      trayEl.classList.remove('is-full'); void trayEl.offsetWidth; trayEl.classList.add('is-full');
      return;
    } else { tray.push(key); announce(label + ' added. ' + tray.length + ' of ' + MAX + ' in the tray.'); }
    renderTray();
    if (btn) btn.focus();
  }

  trayEl.addEventListener('click', function (e) {
    var r = e.target.closest('[data-tray-remove]');
    if (r) {
      toggleTray(r.getAttribute('data-tray-remove'));
      var next = $('[data-tray-remove]') || $('[data-compare-open]');
      if (!trayEl.hidden && next) next.focus();
    }
  });
  $('[data-compare-clear]').addEventListener('click', function () { tray = []; renderTray(); announce('Compare tray cleared.'); });

  /* ---------- dialogs ---------- */
  var cmpDlg = $('[data-compare]'), planDlg = $('[data-plan]'), lastFocus = null;
  function openDlg(d, from) {
    lastFocus = from || document.activeElement;
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    document.documentElement.classList.add('dlg-open');
  }
  function closeDlg(d) { if (d.open) d.close(); }
  [cmpDlg, planDlg].forEach(function (d) {
    d.addEventListener('close', function () {
      document.documentElement.classList.remove('dlg-open');
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    });
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { closeDlg(d); return; }
      if (e.target === d) { // click on backdrop
        var r = d.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDlg(d);
      }
    });
  });

  function openPlan(key, from) {
    var x = findUnit(key);
    $('[data-plan-h]').textContent = x.p.name + ' · apartment ' + x.u.n;
    var img = $('[data-plan-img]');
    img.src = T.img(x.u.plan);
    img.alt = 'Floor plan of ' + x.p.name + ' apartment ' + x.u.n + ', ' + T.fmtArea(x.u.area);
    openDlg(planDlg, from);
  }

  function renderCompare() {
    var items = tray.map(findUnit);
    function best(fn) { var v = items.map(fn), m = Math.max.apply(null, v); return function (i) { return items.length > 1 && v[i] === m && v.filter(function (y) { return y === m; }).length < items.length; }; }
    var bArea = best(function (x) { return x.u.area; });
    var bOut = best(function (x) { var o = T.outdoor(x.u); return o ? o.value : 0; });
    var bBeds = best(function (x) { return x.u.beds; });
    var mark = '<span class="best">largest</span>', markMost = '<span class="best">most</span>';
    var rows = [
      ['Project', function (x) { return esc(x.p.name) + '<br><span class="muted">' + esc(x.p.area) + '</span>'; }],
      ['Interior area', function (x, i) { return T.fmtArea(x.u.area) + (bArea(i) ? mark : ''); }],
      ['Bedrooms', function (x, i) { return x.u.beds + (bBeds(i) ? markMost : ''); }],
      ['Bathrooms', function (x) { return x.u.baths; }],
      ['Outdoor space', function (x, i) { var o = T.outdoor(x.u); return (o ? o.label + ' ' + T.fmtArea(o.value) : '—') + (o && bOut(i) ? mark : ''); }],
      ['Duplex', function (x) { return x.u.duplex ? 'Yes' : 'No'; }],
      ['Status', function (x) { return priceLabel(x.p); }],
      ['Floor plan', function (x) { return '<span class="cmp__plan"><img src="' + T.img(x.u.plan) + '" alt="Floor plan of ' + esc(x.p.name) + ' apartment ' + x.u.n + '" loading="lazy"></span>'; }]
    ];
    $('[data-compare-body]').innerHTML =
      '<table class="cmp__t"><caption class="sr">Comparison of ' + items.length + ' apartments</caption>' +
      '<thead><tr><td></td>' + items.map(function (x) {
        return '<th scope="col"><span class="cmp__arch" style="background-image:url(\'' + T.img(x.p.card) + '\')" aria-hidden="true"></span>' +
          '<span class="cmp__name">' + esc(shortName(x.p)) + ' · Apt ' + x.u.n + '</span></th>';
      }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><th scope="row">' + r[0] + '</th>' + items.map(function (x, i) { return '<td>' + r[1](x, i) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  }

  $('[data-compare-open]').addEventListener('click', function (e) {
    if (tray.length < 2) return;
    renderCompare(); openDlg(cmpDlg, e.currentTarget);
  });

  $('[data-compare-enquire]').addEventListener('click', function () {
    var items = tray.map(findUnit);
    var projects = items.map(function (x) { return x.p.name; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var msg = 'I would like to know more about: ' + items.map(function (x) { return x.p.name + ' apartment ' + x.u.n + ' (' + T.fmtArea(x.u.area) + ')'; }).join('; ') + '.';
    setInterest(projects.length === 1 ? (items[0].p.status === 'sold' ? 'Homes similar to ' + projects[0] : projects[0]) : 'General enquiry');
    $('#message').value = msg;
    lastFocus = null;
    closeDlg(cmpDlg);
  });

  /* ---------- interest prefill ---------- */
  function setInterest(v) {
    var sel = $('#interest');
    if (!$$('option', sel).some(function (o) { return o.value === v; })) { var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); }
    sel.value = v;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (a) setInterest(a.getAttribute('data-interest'));
  });

  /* ---------- process: four arches ---------- */
  var procImg = [
    ['top__img.jpg', 'Port de Sóller from above: a residential plot among pines, near the bay'],
    ['direction-1.jpg', 'An architectural floor-plan drawing'],
    ['direction-2.jpg', 'A residential building under construction, its concrete frame wrapped in scaffolding'],
    ['projects/solivar/solivar-gallery-05.jpg', 'A finished living room in S’Olivar with a glass wall to the garden']
  ];
  $('[data-process]').innerHTML = T.process.map(function (s, i) {
    return '<li class="arch-step">' +
      '<span class="arch-step__img"><img src="' + T.img(procImg[i][0]) + '" alt="' + procImg[i][1] + '" loading="lazy" width="800" height="1000"></span>' +
      '<span class="arch-step__n" aria-hidden="true">' + (i + 1) + '</span>' +
      '<p class="arch-step__k">' + esc(s.step) + '</p>' +
      '<h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>';
  }).join('');

  /* ---------- services: three trades ---------- */
  var groups = [
    { name: 'Build', es: 'Construir', intro: 'From the plot to a finished home — or a careful renovation.' },
    { name: 'Buy & sell', es: 'Comprar y vender', intro: 'Finding, valuing, selling and renting property.' },
    { name: 'Advise', es: 'Asesorar', intro: 'Consultation, legal and financial support at every step.' }
  ];
  $('[data-services]').innerHTML = groups.map(function (g, gi) {
    var list = T.services.filter(function (s) { return s.group === g.name; });
    return '<details class="trade"' + (gi === 0 ? ' open' : '') + '>' +
      '<summary><span class="trade__n" aria-hidden="true">' + ['I', 'II', 'III'][gi] + '</span>' +
      '<span class="trade__t"><span class="trade__name">' + esc(g.name) + '</span> <span class="trade__es" lang="es">' + g.es + '</span></span>' +
      '<span class="trade__c">' + plural(list.length, 'service') + '</span><span class="trade__pm" aria-hidden="true"></span></summary>' +
      '<div class="trade__body"><p class="trade__intro">' + g.intro + '</p><ul class="trade__list">' +
      list.map(function (s) {
        return '<li><span class="ico" style="--ico:url(\'' + T.img('icons/' + s.icon) + '\')" aria-hidden="true"></span>' +
          '<h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>';
      }).join('') + '</ul></div></details>';
  }).join('');

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window && !T.reducedMotion()) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sh, .pillars li, .doors li, .arch-step, .trade, .invest__fig, .invest__text, .hello__intro, .form').forEach(function (el) { el.classList.add('rv'); io.observe(el); });
  }

  renderRoom(order[0]);
  renderTray();
  $('[data-year]').textContent = new Date().getFullYear();
})();
