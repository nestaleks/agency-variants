/* Concept E — Mediterráneo: split headline, parallax sun, sticky story, project reel + story modal, service tabs */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var T = window.TID, esc = T.esc, RM = T.reducedMotion();

  /* ---- nav ---- */
  var nav = $('[data-nav]'), tog = $('[data-toggle]'), panel = $('[data-panel]');
  function setNav(o) { tog.setAttribute('aria-expanded', String(o)); panel.classList.toggle('is-open', o); nav.classList.toggle('is-open', o); }
  tog.addEventListener('click', function () { setNav(tog.getAttribute('aria-expanded') !== 'true'); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('is-open')) { setNav(false); tog.focus(); } });

  /* ---- split headline into words for a staggered rise ---- */
  var h = $('[data-split]');
  if (!RM) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--d', (i++ * 70) + 'ms');
            var inner = document.createElement('span'); inner.textContent = w; s.appendChild(inner); frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(h);
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    requestAnimationFrame(function () { h.classList.add('is-in'); });
  }

  /* ---- scroll effects: header state, hero parallax/sun, story step ---- */
  var media = $('[data-parallax]'), sun = $('[data-sun]'), story = $('[data-story]');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > window.innerHeight * 0.6);
    if (!RM && y < window.innerHeight * 1.2) {
      media.style.transform = 'translate3d(0,' + (y * 0.25).toFixed(1) + 'px,0) scale(1.06)';
      sun.style.transform = 'translate3d(0,' + (y * -0.35).toFixed(1) + 'px,0)';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---- story steps ---- */
  var tones = ['sand', 'paper', 'olive', 'sea'];
  $('[data-steps]').innerHTML = T.process.map(function (s, i) {
    return '<li class="sstep" data-step="' + i + '"><p class="sstep__k">Chapter ' + (i + 1) + ' · ' + s.step + '</p><h3 class="sstep__h">' + s.title + '</h3><p>' + s.text + '</p>' +
      '<figure class="sstep__mob" aria-hidden="true"><img src="' + $('[data-frame="' + i + '"] img').getAttribute('src') + '" alt="" loading="lazy"></figure></li>';
  }).join('');
  if ('IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var n = +en.target.getAttribute('data-step');
        $$('.sstep').forEach(function (s) { s.classList.toggle('is-active', s === en.target); });
        $$('[data-frame]').forEach(function (f) { f.classList.toggle('is-on', +f.getAttribute('data-frame') === n); });
        $$('.story__dots li').forEach(function (d, j) { d.classList.toggle('is-on', j === n); });
        story.setAttribute('data-tone', tones[n]);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    $$('.sstep').forEach(function (s) { sio.observe(s); });
  }

  /* ---- homes reel ---- */
  var order = ['marina-residence', 'foners-club', 'can-marques', 'boho-corner', 'solivar'];
  var reel = $('[data-reel]');
  reel.innerHTML = order.map(function (id, i) {
    var p = T.project(id);
    return '<li class="slide"><article class="hcard">' +
      '<img src="' + T.img(p.gallery[0]) + '" alt="" loading="lazy" width="1920" height="1080">' +
      '<div class="hcard__body"><p class="hcard__st' + (p.status === 'sold' ? ' is-sold' : '') + '">' + p.statusLabel + '</p>' +
      '<h3 class="hcard__h">' + esc(p.name) + '</h3><p class="hcard__area">' + esc(p.area) + '</p>' +
      '<p class="hcard__es" lang="es">' + esc(p.headlineEs) + '</p>' +
      '<button type="button" class="hcard__btn" data-open="' + p.id + '">Discover ' + esc(p.name) + ' <span aria-hidden="true">↗</span></button></div></article></li>';
  }).join('');
  function step(dir) {
    var card = $('.slide', reel); var w = card ? card.getBoundingClientRect().width + 16 : 400;
    reel.scrollBy({ left: dir * w, behavior: RM ? 'auto' : 'smooth' });
  }
  $('[data-prev]').addEventListener('click', function () { step(-1); });
  $('[data-next]').addEventListener('click', function () { step(1); });
  reel.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } });
  function updCtrl() {
    $('[data-prev]').disabled = reel.scrollLeft < 8;
    $('[data-next]').disabled = reel.scrollLeft + reel.clientWidth > reel.scrollWidth - 8;
  }
  reel.addEventListener('scroll', updCtrl, { passive: true }); window.addEventListener('resize', updCtrl); updCtrl();
  // drag to scroll (mouse only; touch scrolls natively)
  var drag = null;
  reel.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; drag = { x: e.clientX, l: reel.scrollLeft, moved: false }; reel.classList.add('is-drag'); });
  window.addEventListener('pointermove', function (e) { if (!drag) return; var dx = e.clientX - drag.x; if (Math.abs(dx) > 4) drag.moved = true; reel.scrollLeft = drag.l - dx; });
  window.addEventListener('pointerup', function () { if (drag) { reel.classList.remove('is-drag'); drag = null; } });

  /* ---- project modal with slider ---- */
  var pm = $('[data-pm]'), track = $('[data-pm-track]'), idx = 0, imgs = [], opener = null;
  function go(n) {
    idx = (n + imgs.length) % imgs.length;
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    $('[data-pm-count]').textContent = 'Photo ' + (idx + 1) + ' of ' + imgs.length;
  }
  function openPm(id) {
    var p = T.project(id); imgs = p.gallery;
    track.innerHTML = imgs.map(function (g, j) { return '<img src="' + T.img(g) + '" alt="' + esc(p.name) + ' — photo ' + (j + 1) + '" loading="lazy">'; }).join('');
    $('[data-pm-area]').textContent = p.area + ' · ' + p.statusLabel;
    $('[data-pm-name]').textContent = p.name;
    $('[data-pm-es]').textContent = '“' + p.headlineEs + '”';
    $('[data-pm-text]').textContent = p.summary;
    $('[data-pm-facts]').innerHTML = p.facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('');
    $('[data-pm-amen]').textContent = p.amenities.join(' · ');
    var cta = $('[data-pm-cta]');
    cta.textContent = p.status === 'sold' ? 'Ask about similar homes' : 'Request availability';
    cta.setAttribute('data-interest', p.status === 'sold' ? 'Homes similar to ' + p.name : p.name);
    go(0);
    pm.showModal();
  }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-open]'); if (b) { if (drag && drag.moved) return; opener = b; openPm(b.getAttribute('data-open')); } });
  $('[data-pm-prev]').addEventListener('click', function () { go(idx - 1); });
  $('[data-pm-next]').addEventListener('click', function () { go(idx + 1); });
  $('[data-pm-close]').addEventListener('click', function () { pm.close(); });
  pm.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1); });
  pm.addEventListener('click', function (e) { if (e.target === pm) pm.close(); });
  pm.addEventListener('close', function () { if (opener) opener.focus(); });
  var sx = null, slider = $('[data-pm-slider]');
  slider.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1)); sx = null; });
  $('[data-pm-cta]').addEventListener('click', function () { pm.close(); });

  /* ---- services tabs ---- */
  var groups = {}; T.services.forEach(function (s) { (groups[s.group] = groups[s.group] || []).push(s); });
  var keys = Object.keys(groups);
  var blurbs = { 'Build': 'From finding the plot to a turnkey custom home or a careful renovation.', 'Buy & sell': 'Buying, selling, renting or valuing property — with professional support.', 'Advise': 'Consultation, legal and process support, financial and investment advice.' };
  $('[data-stabs]').innerHTML = keys.map(function (k, i) {
    return '<button type="button" role="tab" id="st-' + i + '" aria-controls="sp-' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i ? -1 : 0) + '">' + k + '</button>';
  }).join('');
  $('[data-spanels]').innerHTML = keys.map(function (k, i) {
    return '<div class="spanel" role="tabpanel" id="sp-' + i + '" aria-labelledby="st-' + i + '"' + (i ? ' hidden' : '') + '><p class="spanel__lead">' + blurbs[k] + '</p><ul>' +
      groups[k].map(function (s) { return '<li><span class="spanel__ic" style="--ic:url(../../images/icons/' + s.icon + ')" aria-hidden="true"></span><h3>' + s.title + '</h3><p>' + s.text + '</p></li>'; }).join('') + '</ul></div>';
  }).join('');
  var stabs = $$('[data-stabs] [role="tab"]');
  function selT(t) { stabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; }); }
  stabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selT(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
      var n = stabs[(i + d + stabs.length) % stabs.length]; selT(n); n.focus();
    });
  });

  /* ---- interest prefill ---- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-interest]'); if (!a) return;
    var sel = $('#interest'), v = a.getAttribute('data-interest');
    if (!$$('option', sel).some(function (o) { return o.value === v; })) { var o = document.createElement('option'); o.value = o.textContent = v; sel.appendChild(o); }
    sel.value = v;
  });

  /* ---- reveals ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
    $$('.h2, .quote__fig, .quote__q, .invest__card, .card').forEach(function (el) { el.classList.add('pop'); io.observe(el); });
  }
  $('[data-year]').textContent = new Date().getFullYear();
})();
