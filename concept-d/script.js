/* Concept D — Marès: works selector with photo/drawing toggle and measured area bars */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;

  /* header */
  var bar = $('[data-bar]'), menu = $('[data-menu]'), nav = $('[data-nav]');
  window.addEventListener('scroll', function () { bar.classList.toggle('is-line', window.scrollY > 10); }, { passive: true });
  function setMenu(o) { menu.setAttribute('aria-expanded', String(o)); nav.classList.toggle('is-open', o); menu.textContent = o ? 'Close' : 'Menu'; }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menu.focus(); } });

  /* works */
  var order = ['solivar', 'boho-corner', 'can-marques', 'foners-club', 'marina-residence'];
  var maxArea = Math.max.apply(null, T.projects.map(function (p) { return Math.max.apply(null, p.units.map(function (u) { var o = T.outdoor(u); return u.area + (o ? o.value : 0); })); }));
  var view = 'photo', cur = null;
  $('[data-wlist]').innerHTML = order.map(function (id, i) {
    var p = T.project(id);
    return '<li><button type="button" class="wbtn" aria-pressed="' + (i === 0) + '" data-w="' + p.id + '">' +
      '<span class="wbtn__n">0' + (i + 1) + '</span><span class="wbtn__name">' + esc(p.name) + '</span>' +
      '<span class="wbtn__loc">' + esc(p.area) + '</span><span class="wbtn__homes">' + p.units.length + ' homes</span>' +
      '<span class="wbtn__st">' + (p.status === 'sold' ? 'Completed' : 'In progress') + '</span></button></li>';
  }).join('');

  function render(id, focusSafe) {
    var p = T.project(id); cur = p;
    $$('[data-w]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-w') === id)); });
    var d = $('[data-wdetail]');
    d.classList.remove('is-in'); void d.offsetWidth; d.classList.add('is-in');
    setImg();
    $('[data-w-name]').textContent = p.name;
    $('[data-w-meta]').textContent = p.area + ', ' + p.city + ' — ' + (p.status === 'sold' ? 'Completed, sold' : 'In progress');
    $('[data-w-text]').textContent = p.summary;
    $('[data-w-facts]').innerHTML = p.facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('');
    $('[data-w-legend]').textContent = '— ■ interior ▨ outdoor · scale 0–' + Math.ceil(maxArea / 10) * 10 + ' m²';
    $('[data-w-bars]').innerHTML = p.units.map(function (u) {
      var o = T.outdoor(u), w = (u.area / maxArea * 100).toFixed(1), ow = o ? (o.value / maxArea * 100).toFixed(1) : 0;
      return '<li><span class="bars__k">' + u.n + '</span><span class="bars__track"><span class="bars__in" style="--w:' + w + '%"></span>' + (o ? '<span class="bars__out" style="--w:' + ow + '%;--w-in:' + w + '%"></span>' : '') + '</span>' +
        '<span class="bars__v">' + T.fmtArea(u.area) + ' · ' + u.beds + ' bed' + (o ? ' · ' + o.label.toLowerCase() + ' ' + T.fmtArea(o.value) : '') + '</span></li>';
    }).join('');
    var cta = $('[data-w-cta]');
    cta.textContent = p.status === 'sold' ? 'Ask about similar homes' : 'Enquire about ' + p.name;
    cta.setAttribute('data-interest', p.status === 'sold' ? 'Homes similar to ' + p.name : p.name);
  }
  function setImg() {
    var img = $('[data-w-img]'), fig = img.parentNode;
    var src = view === 'plan' ? cur.plans[0] : cur.gallery[0];
    fig.classList.toggle('is-plan', view === 'plan');
    img.src = T.img(src);
    img.alt = view === 'plan' ? 'Architectural drawing of ' + cur.name : 'Photograph of ' + cur.name + ', ' + cur.area;
  }
  $('[data-wlist]').addEventListener('click', function (e) { var b = e.target.closest('[data-w]'); if (b) render(b.getAttribute('data-w')); });
  $$('[data-view]').forEach(function (b) {
    b.addEventListener('click', function () {
      view = b.getAttribute('data-view');
      $$('[data-view]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      setImg();
    });
  });
  render(order[0]);

  /* method */
  $('[data-steps]').innerHTML = T.process.map(function (s, i) {
    return '<li><span class="steps__n">' + (i + 1) + '</span><h3>' + s.title + '</h3><p>' + s.text + '</p></li>';
  }).join('');

  /* services */
  $('[data-services]').innerHTML = T.services.map(function (s) { return '<div><dt>' + s.title + '</dt><dd>' + s.text + '</dd></div>'; }).join('');

  /* interest prefill */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (!a) return;
    var sel = $('#interest'), v = a.getAttribute('data-interest');
    if (!$$('option', sel).some(function (o) { return o.value === v; })) { var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); }
    sel.value = v;
  });

  /* quiet reveal */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    $$('.sh, .principles li, .steps li, .method__fig, .slist div, .inv, .enq').forEach(function (el) { el.classList.add('q'); io.observe(el); });
  }
  $('[data-year]').textContent = new Date().getFullYear();
})();
