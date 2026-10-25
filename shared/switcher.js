/*
 * Presentation switcher shown on every concept page: back to gallery + quick jump between concepts.
 * Self-contained: injects its own styles, all prefixed `dc-sw` to avoid collisions with concept CSS.
 * Reads the current concept from <html data-concept="a…m">.
 */
(function () {
  var CONCEPTS = [
    { id: 'a', name: 'Catálogo Vivo' },
    { id: 'b', name: 'Atlas Editorial' },
    { id: 'c', name: 'Investor Desk' },
    { id: 'd', name: 'Marès' },
    { id: 'e', name: 'Mediterráneo' },
    { id: 'f', name: 'Casa de Cal' },
    { id: 'g', name: 'Obra' },
    { id: 'h', name: 'Nocturno' },
    { id: 'i', name: 'Carta Náutica' },
    { id: 'j', name: 'Hogar Match' },
    { id: 'k', name: 'Postal' },
    { id: 'l', name: 'Agua' },
    { id: 'm', name: 'Dossier' }
  ];
  var current = document.documentElement.getAttribute('data-concept');

  var css = [
    '.dc-sw{position:fixed;left:16px;bottom:16px;z-index:9999;display:flex;align-items:center;gap:4px;padding:4px;',
    'background:#111;color:#f5f2ec;border-radius:999px;font:500 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;',
    'box-shadow:0 6px 24px rgba(0,0,0,.28);}',
    '.dc-sw a{color:inherit;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:36px;padding:0 10px;border-radius:999px;}',
    '.dc-sw a:hover{background:rgba(255,255,255,.14);}',
    '.dc-sw a:focus-visible{outline:2px solid #fff;outline-offset:2px;}',
    '.dc-sw a[aria-current="page"]{background:#f5f2ec;color:#111;}',
    '.dc-sw__back{gap:6px;padding-right:12px!important;border-right:1px solid rgba(255,255,255,.18);border-radius:999px 0 0 999px!important;}',
    '.dc-sw__label{font-weight:400;opacity:.7;}',
    '.dc-sw__toggle{display:none}',
    '@media (max-width:600px){.dc-sw{left:8px;max-width:calc(100% - 16px);bottom:8px;font-size:12px;overflow-x:auto;scrollbar-width:none}.dc-sw::-webkit-scrollbar{display:none}.dc-sw a{min-width:32px;height:36px;padding:0 8px;flex:0 0 auto}.dc-sw__label{display:none}}',
    '@media print{.dc-sw{display:none}}'
  ].join('');

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var nav = document.createElement('nav');
    nav.className = 'dc-sw';
    nav.setAttribute('aria-label', 'Design concepts');
    var html = '<a class="dc-sw__back" href="../"><span aria-hidden="true">←</span> <span>Gallery</span></a>';
    CONCEPTS.forEach(function (c) {
      var cur = c.id === current ? ' aria-current="page"' : '';
      html += '<a href="../concept-' + c.id + '/"' + cur + ' title="Concept ' + c.id.toUpperCase() + ' — ' + c.name + '">' +
        '<span aria-hidden="true">' + c.id.toUpperCase() + '</span><span class="dc-sw-sr" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Concept ' + c.id.toUpperCase() + ' — ' + c.name + '</span></a>';
    });
    nav.innerHTML = html;
    document.body.appendChild(nav);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
