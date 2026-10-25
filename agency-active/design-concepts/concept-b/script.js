/* Concept B — Atlas Editorial */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc;
  var order = ['marina-residence', 'foners-club', 'can-marques', 'solivar', 'boho-corner'];
  var layouts = ['bleed', 'split', 'stack', 'split', 'stack'];
  function nn(i) { return (i + 1 < 10 ? '0' : '') + (i + 1); }

  /* ---- masthead ---- */
  var mast = $('[data-mast]'), menu = $('[data-menu]'), nav = $('[data-nav]');
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    mast.classList.toggle('is-compact', y > 120);
  }, { passive: true });
  function setMenu(open) { menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); document.body.classList.toggle('lock', open); }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menu.focus(); } });

  /* ---- table of contents with image peek ---- */
  $('[data-toc]').innerHTML = order.map(function (id, i) {
    var p = T.project(id);
    return '<li><a class="toc__a" href="#f-' + p.id + '" data-peek-src="' + T.img(p.gallery[0]) + '">' +
      '<span class="toc__n">' + nn(i) + '</span><span class="toc__name">' + esc(p.name) + '</span>' +
      '<span class="toc__area">' + esc(p.area) + '</span><span class="toc__st' + (p.status === 'sold' ? ' is-sold' : '') + '">' + p.statusLabel + '</span></a></li>';
  }).join('');
  var peek = $('[data-peek]'), peekImg = $('img', peek);
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) {
    $$('.toc__a').forEach(function (a) {
      a.addEventListener('mouseenter', function () { peekImg.src = a.getAttribute('data-peek-src'); peek.classList.add('is-on'); });
      a.addEventListener('mouseleave', function () { peek.classList.remove('is-on'); });
      a.addEventListener('mousemove', function (e) { peek.style.transform = 'translate(' + (e.clientX + 24) + 'px,' + (e.clientY - 120) + 'px)'; });
    });
  }

  /* ---- features ---- */
  $('[data-features]').innerHTML = order.map(function (id, i) {
    var p = T.project(id), L = layouts[i];
    var imgs = p.gallery;
    var rows = p.units.map(function (u) {
      var o = T.outdoor(u);
      return '<tr><th scope="row">' + u.n + '</th><td>' + T.fmtArea(u.area) + '</td><td>' + u.beds + '</td><td>' + u.baths + '</td><td>' + (o ? o.label.toLowerCase() + ' ' + T.fmtArea(o.value) : '—') + '</td><td><a href="' + T.img(u.plan) + '" target="_blank" rel="noopener">Plan<span class="sr"> of apartment ' + u.n + ' (opens image)</span></a></td></tr>';
    }).join('');
    var facts = '<dl class="ft__facts">' + p.facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('') + '</dl>';
    var units = '<details class="ft__units"><summary>The apartments <span>(' + p.units.length + ')</span></summary>' +
      '<div class="ft__tablewrap"><table><thead><tr><th scope="col">Nº</th><th scope="col">Area</th><th scope="col">Bed</th><th scope="col">Bath</th><th scope="col">Outdoor</th><th scope="col"><span class="sr">Plan</span></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="ft__note">' + (p.status === 'sold' ? 'All apartments sold.' : 'Prices and availability on request.') + '</p></details>';
    var cta = p.status === 'sold'
      ? '<a class="lnk" href="#write" data-interest="Homes similar to ' + esc(p.name) + '">Ask about similar homes <span aria-hidden="true">→</span></a>'
      : '<a class="btn" href="#write" data-interest="' + esc(p.name) + '">Request availability</a>';
    var head = '<p class="ft__kicker"><span>Nº ' + nn(i) + '</span> ' + esc(p.area) + ' · ' + esc(p.city) + '</p>' +
      '<h2 class="ft__name" id="fh-' + p.id + '">' + esc(p.name) + '</h2>';
    var quote = '<blockquote class="ft__quote"><p lang="es">' + esc(p.headlineEs) + '</p><footer>' + esc(p.headline) + '</footer></blockquote>';
    var body = '<p class="ft__text">' + esc(p.summary) + '</p>' + facts + '<p class="ft__amen">' + p.amenities.join(' · ') + '</p>' + units + '<div class="ft__cta">' + cta + '</div>';
    var fig = function (src, cls, alt) { return '<figure class="' + cls + '"><img src="' + T.img(src) + '" alt="' + esc(alt) + '" loading="lazy"></figure>'; };

    var inner;
    if (L === 'bleed') {
      inner = fig(imgs[0], 'ft__bleed', p.name + ' — exterior') +
        '<div class="ft__grid"><div class="ft__head">' + head + quote + '</div><div class="ft__body">' + body + '</div></div>' +
        '<div class="ft__strip">' + fig(imgs[1], 'ft__s1', p.name + ' — view 2') + fig(imgs[2], 'ft__s2', p.name + ' — view 3') + fig(imgs[3], 'ft__s3', p.name + ' — view 4') + '</div>';
    } else if (L === 'split') {
      inner = '<div class="ft__grid ft__grid--split">' +
        '<div class="ft__media">' + fig(imgs[0], 'ft__main', p.name + ' — exterior') + fig(imgs[1], 'ft__inset', p.name + ' — detail') + '</div>' +
        '<div class="ft__copy"><span class="ft__num" aria-hidden="true">' + nn(i) + '</span>' + head + quote + body + '</div></div>';
    } else {
      inner = '<div class="ft__grid ft__grid--stack">' +
        '<div class="ft__copy"><span class="ft__num" aria-hidden="true">' + nn(i) + '</span>' + head + quote + body + '</div>' +
        '<div class="ft__media">' + fig(imgs[0], 'ft__tall', p.name + ' — exterior') + fig(imgs[2] || imgs[1], 'ft__low', p.name + ' — interior or terrace') + '</div></div>';
    }
    return '<article class="ft ft--' + L + (p.status === 'sold' ? ' ft--sold' : '') + '" id="f-' + p.id + '" aria-labelledby="fh-' + p.id + '">' + inner + '</article>';
  }).join('');

  /* ---- process marginalia ---- */
  $('[data-process]').innerHTML = T.process.map(function (s, i) {
    return '<li><span class="margin__n">' + nn(i) + '</span><h3>' + s.title + '</h3><p>' + s.text + '</p></li>';
  }).join('');

  /* ---- services columns ---- */
  var g = {};
  T.services.forEach(function (s) { (g[s.group] = g[s.group] || []).push(s); });
  $('[data-services]').innerHTML = Object.keys(g).map(function (k) {
    return '<div class="scol"><h3 class="scol__h">' + k + '</h3><ul>' + g[k].map(function (s) { return '<li><b>' + s.title + '</b> ' + s.text + '</li>'; }).join('') + '</ul></div>';
  }).join('');

  /* ---- prefill interest ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (!a) return;
    var sel = $('#interest'), v = a.getAttribute('data-interest');
    if (!$$('option', sel).some(function (o) { return o.value === v; })) { var o = document.createElement('option'); o.value = v; o.textContent = v.toLowerCase().indexOf('homes') === 0 ? v.charAt(0).toLowerCase() + v.slice(1) : v; sel.appendChild(o); }
    sel.value = v;
  });

  /* ---- reveal ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    $$('.ft figure, .ft__name, .essay__h, .services__h, .invest__h, .island__h, .write__h, .toc li').forEach(function (el) { el.classList.add('rv'); io.observe(el); });
  }
  $('[data-year]').textContent = new Date().getFullYear();
})();
