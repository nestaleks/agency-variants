/* Concept C — Investor Desk: apartment finder, project tabs, unit drawer */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;

  /* ---- header ---- */
  var top = $('[data-top]');
  window.addEventListener('scroll', function () { top.classList.toggle('is-scrolled', window.scrollY > 20); }, { passive: true });
  var burger = $('[data-burger]'), nav = $('[data-nav]');
  function setNav(o) { burger.setAttribute('aria-expanded', String(o)); nav.classList.toggle('is-open', o); }
  burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  /* ---- flatten units ---- */
  var all = [];
  T.projects.forEach(function (p) {
    p.units.forEach(function (u) {
      var o = T.outdoor(u);
      all.push({ p: p, u: u, project: p.name, n: u.n, area: u.area, beds: u.beds, baths: u.baths, outdoor: o ? o.value : 0, outdoorLabel: o ? o.label : '', sold: p.status === 'sold' });
    });
  });

  /* ---- KPIs (derived from published data) ---- */
  var inProg = all.filter(function (x) { return !x.sold; }).length;
  var areas = all.map(function (x) { return x.area; });
  $('[data-kpis]').innerHTML = [
    ['Since', '2018'], ['Buildings', String(T.projects.length)], ['Apartments', String(all.length)], ['In progress', String(inProg)],
    ['Sizes', Math.floor(Math.min.apply(null, areas)) + '–' + Math.ceil(Math.max.apply(null, areas)) + ' m²']
  ].map(function (k) { return '<div><dt>' + k[0] + '</dt><dd class="mono">' + k[1] + '</dd></div>'; }).join('');
  $('[data-total]').textContent = all.length;

  /* ---- hero stage (tablist) ---- */
  var stageIds = ['marina-residence', 'foners-club', 'can-marques'];
  var stageImgs = { 'marina-residence': 1, 'foners-club': 0, 'can-marques': 0 };
  var tabs = $('[data-stage-tabs]');
  tabs.innerHTML = stageIds.map(function (id, i) {
    var p = T.project(id);
    return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-stage="' + id + '"><span class="mono">0' + (i + 1) + '</span> ' + esc(p.name) + '</button>';
  }).join('');
  var stageImg = $('[data-stage-img]'), stageTimer = null, stageIdx = 0;
  function showStage(i, user) {
    stageIdx = i;
    var p = T.project(stageIds[i]);
    $$('[role="tab"]', tabs).forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    stageImg.classList.add('is-out');
    setTimeout(function () {
      stageImg.src = T.img(p.gallery[stageImgs[p.id]]);
      stageImg.alt = p.name + ', ' + p.area;
      $('[data-stage-name]').textContent = p.name;
      $('[data-stage-area]').textContent = p.area;
      $('[data-stage-status]').textContent = p.statusLabel + ' · ' + p.units.length + ' apartments';
      stageImg.onload = function () { stageImg.classList.remove('is-out'); };
    }, T.reducedMotion() ? 0 : 250);
    if (user) clearInterval(stageTimer);
  }
  tabs.addEventListener('click', function (e) { var b = e.target.closest('[data-stage]'); if (b) showStage(stageIds.indexOf(b.getAttribute('data-stage')), true); });
  tabs.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var i = (stageIdx + (e.key === 'ArrowRight' ? 1 : -1) + stageIds.length) % stageIds.length;
    showStage(i, true); $$('[role="tab"]', tabs)[i].focus();
  });
  showStage(0);
  if (!T.reducedMotion()) stageTimer = setInterval(function () { showStage((stageIdx + 1) % stageIds.length); }, 6000);
  $('[data-stage]').addEventListener('mouseenter', function () { clearInterval(stageTimer); });

  /* ---- finder ---- */
  var form = $('[data-filters]');
  var chipBox = $('[data-f-projects]');
  chipBox.innerHTML = T.projects.map(function (p) {
    return '<label class="chip"><input type="checkbox" name="proj" value="' + p.id + '" checked><span>' + esc(p.name) + (p.status === 'sold' ? ' <i>sold</i>' : '') + '</span></label>';
  }).join('');
  var sortKey = 'area', sortDir = -1, current = [];

  function apply() {
    var projs = $$('input[name="proj"]:checked', form).map(function (i) { return i.value; });
    var beds = +form.beds.value, minA = +form.minArea.value, outdoorOnly = form.outdoor.checked, avail = form.available.checked;
    $('[data-area-out]').textContent = minA + ' m²';
    current = all.filter(function (x) {
      return projs.indexOf(x.p.id) > -1 && x.beds >= beds && x.area >= minA && (!outdoorOnly || x.outdoor >= 20) && (!avail || !x.sold);
    }).sort(function (a, b) {
      var va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') return va.localeCompare(vb) * sortDir || (a.n - b.n);
      return (va - vb) * sortDir || a.project.localeCompare(b.project) || a.n - b.n;
    });
    $('[data-tbody]').innerHTML = current.map(function (x, i) {
      return '<tr data-i="' + i + '" class="' + (x.sold ? 'is-sold' : '') + '">' +
        '<td data-l="Project">' + esc(x.project) + '</td><td data-l="Unit" class="mono">' + x.n + '</td>' +
        '<td data-l="Area" class="mono num">' + T.fmtArea(x.area) + '</td><td data-l="Beds" class="mono num">' + x.beds + '</td><td data-l="Baths" class="mono num">' + x.baths + '</td>' +
        '<td data-l="Outdoor" class="mono num">' + (x.outdoor ? T.fmtArea(x.outdoor) + ' <small>' + x.outdoorLabel.toLowerCase() + '</small>' : '—') + '</td>' +
        '<td data-l="Status"><span class="pill' + (x.sold ? ' pill--sold' : '') + '">' + (x.sold ? 'Sold' : 'On request') + '</span></td>' +
        '<td><button type="button" class="rowbtn" data-open="' + i + '">Plan &amp; details<span class="sr"> — ' + esc(x.project) + ' apartment ' + x.n + '</span></button></td></tr>';
    }).join('');
    var n = current.length;
    $('[data-count]').innerHTML = '<b class="mono">' + n + '</b> of ' + all.length + ' apartments match';
    $('[data-empty]').hidden = n > 0;
    $('.tablewrap').hidden = n === 0;
  }
  form.addEventListener('input', apply);
  form.addEventListener('change', apply);
  form.addEventListener('reset', function () { setTimeout(apply, 0); });
  $('[data-clear]').addEventListener('click', function () { form.reset(); });

  $$('[data-sort]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-sort');
      sortDir = k === sortKey ? -sortDir : (k === 'project' || k === 'n' ? 1 : -1);
      sortKey = k;
      $$('th[aria-sort]').forEach(function (th) { th.removeAttribute('aria-sort'); });
      b.parentNode.setAttribute('aria-sort', sortDir > 0 ? 'ascending' : 'descending');
      apply();
    });
  });
  apply();

  /* ---- drawer ---- */
  var dlg = $('[data-drawer]'), di = 0, opener = null;
  function fill(i) {
    di = i; var x = current[i]; if (!x) return;
    $('[data-d-kicker]').textContent = x.project + ' · ' + x.p.area;
    $('[data-d-title]').textContent = 'Apartment ' + x.n;
    var img = $('[data-d-plan]'); img.src = T.img(x.u.plan); img.alt = 'Floor plan of ' + x.project + ' apartment ' + x.n;
    var specs = [['Interior area', T.fmtArea(x.area)], ['Bedrooms', x.beds], ['Bathrooms', x.baths]];
    if (x.outdoor) specs.push([x.outdoorLabel, T.fmtArea(x.outdoor)]);
    if (x.u.duplex) specs.push(['Layout', 'Two levels']);
    specs.push(['Status', x.sold ? 'Sold' : 'Price on request']);
    $('[data-d-specs]').innerHTML = specs.map(function (s) { return '<div><dt>' + s[0] + '</dt><dd class="mono">' + s[1] + '</dd></div>'; }).join('');
    var req = $('[data-d-request]');
    req.textContent = x.sold ? 'Ask about similar homes' : 'Request this apartment';
    $('[data-d-prev]').disabled = i === 0; $('[data-d-next]').disabled = i === current.length - 1;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]');
    if (b) { opener = b; fill(+b.getAttribute('data-open')); dlg.showModal(); }
  });
  $('[data-tbody]').addEventListener('click', function (e) {
    if (e.target.closest('button')) return;
    var tr = e.target.closest('tr'); if (tr) $('[data-open]', tr).click();
  });
  $('[data-d-close]').addEventListener('click', function () { dlg.close(); });
  $('[data-d-prev]').addEventListener('click', function () { fill(di - 1); });
  $('[data-d-next]').addEventListener('click', function () { fill(di + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { if (opener) opener.focus(); });
  $('[data-d-request]').addEventListener('click', function () {
    var x = current[di];
    prefill(x.sold ? 'Homes similar to ' + x.project : x.project, (x.sold ? 'I am looking for a home similar to ' : 'I would like the price and availability of ') + x.project + ', apartment ' + x.n + ' (' + T.fmtArea(x.area) + ', ' + x.beds + ' bedrooms).');
    dlg.close();
    location.hash = '#contact';
    setTimeout(function () { $('#name').focus(); }, 400);
  });

  function prefill(interest, msg) {
    var sel = $('#interest');
    if (!$$('option', sel).some(function (o) { return o.value === interest; })) { var o = document.createElement('option'); o.value = o.textContent = interest; sel.appendChild(o); }
    sel.value = interest;
    if (msg) $('[data-message]').value = msg;
  }
  document.addEventListener('click', function (e) { var a = e.target.closest('[data-interest]'); if (a) prefill(a.getAttribute('data-interest')); });

  /* ---- project tabs ---- */
  function card(p) {
    return '<article class="pcard">' +
      '<div class="pcard__img"><img src="' + T.img(p.gallery[0]) + '" alt="' + esc(p.name) + ', ' + esc(p.area) + '" loading="lazy" width="1920" height="1080"><span class="pill' + (p.status === 'sold' ? ' pill--sold' : '') + '">' + p.statusLabel + '</span></div>' +
      '<div class="pcard__body"><h3>' + esc(p.name) + '</h3><p class="mono pcard__area">' + esc(p.area) + ' · ' + esc(p.city) + '</p>' +
      '<p class="pcard__text">' + esc(p.summary) + '</p>' +
      '<dl class="pcard__facts">' + p.facts.slice(0, 3).map(function (f) { return '<div><dt>' + f[0] + '</dt><dd class="mono">' + f[1] + '</dd></div>'; }).join('') + '</dl>' +
      '<p class="pcard__amen">' + p.amenities.join(' · ') + '</p>' +
      '<button type="button" class="btn btn--ghost btn--sm" data-filter-to="' + p.id + '">See its ' + p.units.length + ' apartments</button></div></article>';
  }
  var ip = T.projects.filter(function (p) { return p.status !== 'sold'; }), sd = T.projects.filter(function (p) { return p.status === 'sold'; });
  $('[data-panel="in-progress"]').innerHTML = ip.map(card).join('');
  $('[data-panel="sold"]').innerHTML = sd.map(card).join('');
  $('[data-n-ip]').textContent = ip.length; $('[data-n-sold]').textContent = sd.length;
  var ptabs = $$('.ptabs [role="tab"]');
  function selTab(t) {
    ptabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
  }
  ptabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selTab(t); });
    t.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = ptabs[(i + 1) % 2]; selTab(n); n.focus(); } });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter-to]'); if (!b) return;
    var id = b.getAttribute('data-filter-to');
    form.reset();
    $$('input[name="proj"]', form).forEach(function (c) { c.checked = c.value === id; });
    form.available.checked = T.project(id).status !== 'sold';
    apply();
    $('#finder').scrollIntoView({ behavior: T.reducedMotion() ? 'auto' : 'smooth' });
  });

  /* ---- process + services ---- */
  $('[data-steps]').innerHTML = T.process.map(function (s, i) {
    return '<li><span class="mono step__i">0' + (i + 1) + ' — ' + s.step + '</span><h3>' + s.title + '</h3><p>' + s.text + '</p></li>';
  }).join('');
  var g = {};
  T.services.forEach(function (s) { (g[s.group] = g[s.group] || []).push(s); });
  $('[data-services]').innerHTML = Object.keys(g).map(function (k) {
    return '<div class="svc__g"><h3>' + k + '</h3><ul>' + g[k].map(function (s) {
      return '<li><span class="svc__ic" style="--ic:url(../images/icons/' + s.icon + ')" aria-hidden="true"></span><span><b>' + s.title + '</b><br>' + s.text + '</span></li>';
    }).join('') + '</ul></div>';
  }).join('');

  $('[data-year]').textContent = new Date().getFullYear();
})();
