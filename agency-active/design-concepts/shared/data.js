/*
 * TID group — single source of truth for the design concepts.
 * All facts come from the current website (agency-active/*.html) and the 2026 printed catalog (style-images/).
 * Prices are intentionally omitted: in-progress prices on the live site look like placeholders (see DECISIONS.md D3).
 * Image paths are relative to agency-active/images/ — use TID.img(path) to resolve them from a concept page.
 */
(function () {
  var IMG_BASE = '../../images/';

  var company = {
    name: 'TID group',
    legalName: 'Top Invest Development Group SL',
    since: 2018,
    tagline: 'Experience that builds comfort',
    taglineEs: 'Experiencia que construye confort',
    city: 'Palma de Mallorca, Spain',
    phones: ['+34 658 058 102', '+34 662 685 172'],
    emails: { office: 'office@tidgroup.es', info: 'info@tidgroup.es', palma: 'pmallorca@tidgroup.es', mallorca: 'info.mallorca@tidgroup.es' },
    web: 'tidgroup.es',
    pillars: [
      { title: 'Contemporary architecture', text: 'Design, functionality and attention to detail.' },
      { title: 'Quality that lasts', text: 'Materials and solutions selected to stay with you for years.' },
      { title: 'Wellbeing in every space', text: 'Homes designed to make every day more pleasant.' }
    ],
    partners: [
      { name: 'Blanc i Blanc', url: 'https://www.blanciblanc.com/', logo: 'partners-blanc-i-blanc.png' },
      { name: 'RBK Prime', url: 'https://rbkprime.com/', logo: 'partners_rbk.png' }
    ]
  };

  var services = [
    { id: 'land-select', group: 'Build', title: 'Land selection', text: 'We find the plot that meets your needs and preferences.', icon: 'land-select.svg' },
    { id: 'land-purchase', group: 'Build', title: 'Land purchase', text: 'Project creation, construction, sale and rental of the finished property.', icon: 'land-purchase.svg' },
    { id: 'custom', group: 'Build', title: 'Exclusive custom construction', text: 'Individual design and turnkey construction of your own home.', icon: 'custom-construction.svg' },
    { id: 'repair', group: 'Build', title: 'Repair & restoration', text: 'Quality renovation that respects your preferences and deadlines.', icon: 'repair-works.svg' },
    { id: 'purchase', group: 'Buy & sell', title: 'Property purchase', text: 'The right property for your needs and budget, with a secure transaction.', icon: 'property-purchase.svg' },
    { id: 'sales', group: 'Buy & sell', title: 'Property sales', text: 'Valuation, marketing strategy and viewings to sell on the best terms.', icon: 'property-sales.svg' },
    { id: 'rental', group: 'Buy & sell', title: 'Property rental', text: 'Suitable rentals found and the whole rental process guided.', icon: 'property-rental.svg' },
    { id: 'evaluation', group: 'Buy & sell', title: 'Property evaluation', text: 'Market value and investment potential of your property.', icon: 'property-evaluation.svg' },
    { id: 'consult', group: 'Advise', title: 'Consultation', text: 'Expert advice on all real-estate and investment matters.', icon: 'consultation.svg' },
    { id: 'legal', group: 'Advise', title: 'Legal support', text: 'Buying, selling and leasing with a full service cycle.', icon: 'legal-support.svg' },
    { id: 'process', group: 'Advise', title: 'Process support', text: 'Support at every stage of the transaction.', icon: 'process-support.svg' },
    { id: 'finance', group: 'Advise', title: 'Financial services', text: 'Investment consulting and related financial services.', icon: 'financial-services.svg' }
  ];

  var process = [
    { step: 'Plot', title: 'Land selection & purchase', text: 'We search, assess and secure the right plot or building — location first.' },
    { step: 'Design', title: 'Architecture & design', text: 'Architects and designers develop a project tailored to the site, the client and the budget.' },
    { step: 'Build', title: 'Construction', text: 'From foundations to roofing, with quality control and timeline oversight at every phase.' },
    { step: 'Keys', title: 'Sale, rental & support', text: 'Marketing, viewings, legal support and — for investors — rental management, even from abroad.' }
  ];

  function u(n, area, beds, baths, extra) {
    var o = { n: n, area: area, beds: beds, baths: baths };
    for (var k in extra) o[k] = extra[k];
    return o;
  }

  var projects = [
    {
      id: 'marina-residence', name: 'Marina Residence', area: 'Les Meravelles · El Arenal', city: 'Palma',
      status: 'in-progress', statusLabel: 'In progress',
      headline: 'Sea-front living',
      headlineEs: 'Vida en primera línea de mar',
      summary: 'A residential building of 9 apartments by the sea, just 30 metres from El Arenal — Palma’s longest beach. Panoramic views to the horizon and a private rooftop patio for unforgettable evenings.',
      facts: [['Apartments', '9'], ['To the beach', '30 m'], ['Floors', '5'], ['Built area', '845 m²']],
      amenities: ['Rooftop terrace', 'Jacuzzi', 'Terraces', 'Elevator'],
      hero: 'projects/marina-residence/marina-residence-gallery-01.jpg',
      card: 'marina-bg.jpg',
      gallery: ['projects/marina-residence/marina-residence-gallery-01.jpg', 'projects/marina-residence/marina-residence-gallery-02.jpg', 'projects/marina-residence/marina-residence-gallery-03.jpg', 'projects/marina-residence/marina-residence-gallery-04.jpg'],
      plans: ['projects/marina-residence/marina-residence-gallery-plan-1.jpg', 'projects/marina-residence/marina-residence-gallery-plan-2.jpg'],
      page: '../../projects/marina-residence.html',
      units: [
        u(1, 117.51, 3, 2, { terrace: 25.33 }), u(2, 104.02, 2, 2, { terrace: 11.02 }), u(3, 81.58, 2, 2, { terrace: 4.54 }),
        u(4, 45.32, 1, 1, { terrace: 4.1 }), u(5, 82.45, 2, 2, { terrace: 4.02 }), u(6, 81.58, 2, 2, { terrace: 4.54 }),
        u(7, 45.32, 1, 1, { terrace: 4.1 }), u(8, 82.45, 2, 2, { terrace: 4.02 }), u(9, 204.87, 3, 3, { terrace: 86.33 })
      ].map(function (x) { x.plan = 'projects/marina-residence/marina-residence-gallery-apart' + x.n + '.jpg'; return x; })
    },
    {
      id: 'foners-club', name: 'Foners Club', area: 'Foners', city: 'Palma',
      status: 'in-progress', statusLabel: 'In progress',
      headline: 'Urban elegance and comfort',
      headlineEs: 'Elegancia y confort urbano',
      summary: 'An exclusive residential concept with its own pool and commercial premises. Close to Palma’s historic centre and a 10-minute walk from the central beach — for a dynamic lifestyle.',
      facts: [['Apartments', '4'], ['Walk to beach', '10 min'], ['Floors', '5'], ['Built area', '452 m²']],
      amenities: ['Pool', 'Commercial premises', 'Terraces', 'Elevator'],
      hero: 'projects/foners-club/foners-club-gallery-01.jpg',
      card: 'foners-bg.jpg',
      gallery: ['projects/foners-club/foners-club-gallery-01.jpg', 'projects/foners-club/foners-club-gallery-02.jpg', 'projects/foners-club/foners-club-gallery-03.jpg', 'projects/foners-club/foners-club-gallery-04.jpg', 'projects/foners-club/foners-club-gallery-05.jpg'],
      plans: ['projects/foners-club/foners-club-gallery-plan-1.jpg', 'projects/foners-club/foners-club-gallery-plan-6.jpg'],
      page: '../../projects/foners-club.html',
      units: [
        u(1, 100.05, 3, 2, { balcony: 4.14 }), u(2, 102.01, 3, 2, { balcony: 4.14 }),
        u(3, 102.01, 3, 2, { balcony: 4.14 }), u(4, 147.31, 3, 2, { terrace: 45.21 })
      ].map(function (x) { x.plan = 'projects/foners-club/foners-club-gallery-plan-' + (x.n + 1) + '.jpg'; return x; })
    },
    {
      id: 'can-marques', name: 'Can Marquès', area: 'Pere Garau', city: 'Palma',
      status: 'in-progress', statusLabel: 'In progress',
      headline: 'An oasis of privacy and style',
      headlineEs: 'Oasis de privacidad y estilo',
      summary: 'An intimate residence of 9 apartments with a pool and relaxation area. Clean-lined architecture, high-quality execution and an atmosphere of complete serenity.',
      facts: [['Apartments', '9'], ['Floors', '6'], ['Built area', '785 m²'], ['Pool', 'Yes']],
      amenities: ['Pool', 'Relaxation area', 'Terraces', 'Elevator'],
      hero: 'projects/can-marques/can-marques-gallery-01.jpg',
      card: 'can-marques-bg.jpg',
      gallery: ['projects/can-marques/can-marques-gallery-01.jpg', 'projects/can-marques/can-marques-gallery-02.jpg', 'projects/can-marques/can-marques-gallery-03.jpg', 'projects/can-marques/can-marques-gallery-04.jpg', 'projects/can-marques/can-marques-gallery-06.jpg', 'projects/can-marques/can-marques-gallery-07.jpg'],
      plans: ['projects/can-marques/can-marques-gallery-plan-1.jpg', 'projects/can-marques/can-marques-gallery-plan-2.jpg'],
      page: '../../projects/can-marques.html',
      units: [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return u(n, 64.59, 2, 1, { terrace: 2.6 }); })
        .concat([u(9, 177, 3, 4, { terrace: 53, duplex: true })])
        .map(function (x) { x.plan = 'projects/can-marques/can-marques-gallery-apart' + x.n + '.jpg'; return x; })
    },
    {
      id: 'solivar', name: 'S’Olivar', area: 'Port de Sóller', city: 'Sóller',
      status: 'sold', statusLabel: 'Completed · Sold',
      headline: 'A boutique building of premium homes',
      headlineEs: 'Edificio boutique de viviendas premium',
      summary: 'A sophisticated, exclusive residential building of 7 apartments with a private pool, set in one of the island’s most picturesque ports — total privacy and unrivalled views.',
      facts: [['Apartments', '7'], ['Private gardens', 'up to 160 m²'], ['Floors', '3'], ['Status', 'Sold']],
      amenities: ['Private pool', 'Gardens', 'Playground', 'Parking', 'Elevator'],
      hero: 'projects/solivar/solivar-gallery-01.jpg',
      card: 'solivar-bg.jpg',
      gallery: ['projects/solivar/solivar-gallery-01.jpg', 'projects/solivar/solivar-gallery-02.jpg', 'projects/solivar/solivar-gallery-04.jpg', 'projects/solivar/solivar-gallery-05.jpg', 'projects/solivar/solivar-gallery-06.jpg', 'projects/solivar/solivar-gallery-07.jpg'],
      plans: ['projects/solivar/solivar-gallery-plan-1.jpg', 'projects/solivar/solivar-gallery-plan-2.jpg', 'projects/solivar/solivar-gallery-plan-3.jpg'],
      page: '../../projects/solivar.html',
      units: [
        u(1, 106.87, 3, 4, { garden: 160.15, duplex: true, plan: 'projects/solivar/solivar-gallery-plan-1a.jpg' }),
        u(2, 106.87, 3, 4, { garden: 157.37, duplex: true, plan: 'projects/solivar/solivar-gallery-plan-1b.jpg' }),
        u(3, 113.86, 3, 4, { garden: 74.95, duplex: true, plan: 'projects/solivar/solivar-gallery-plan-1c.jpg' }),
        u(4, 116.57, 3, 4, { garden: 117.46, duplex: true, plan: 'projects/solivar/solivar-gallery-plan-1d.jpg' }),
        u(5, 78.66, 2, 3, { plan: 'projects/solivar/solivar-gallery-plan-3a.jpg' }),
        u(6, 78.66, 2, 3, { plan: 'projects/solivar/solivar-gallery-plan-3b.jpg' }),
        u(7, 104.70, 3, 2, { plan: 'projects/solivar/solivar-gallery-plan-3c.jpg' })
      ]
    },
    {
      id: 'boho-corner', name: 'Boho Corner', area: 'El Terreno', city: 'Palma',
      status: 'sold', statusLabel: 'Completed · Sold',
      headline: 'A modern residence in the heart of Palma',
      headlineEs: 'Residencia moderna en el corazón de Palma',
      summary: 'An exclusive building of 8 apartments with its own parking in El Terreno, Palma’s prestigious historic quarter — steps from the Paseo Marítimo and the marina. The balance between city life and the sea breeze.',
      facts: [['Apartments', '8'], ['Roof terraces', 'up to 107 m²'], ['Floors', '2'], ['Status', 'Sold']],
      amenities: ['Private parking', 'Roof terraces', 'Outdoor kitchen', 'Elevator'],
      hero: 'projects/boho-corner/boho-corner-gallery-01.jpg',
      card: 'boho-corner-bg.jpg',
      gallery: ['projects/boho-corner/boho-corner-gallery-01.jpg', 'projects/boho-corner/boho-corner-gallery-02.jpg', 'projects/boho-corner/boho-corner-gallery-06.jpg', 'projects/boho-corner/boho-corner-gallery-07.jpg', 'projects/boho-corner/boho-corner-gallery-08.jpg', 'projects/boho-corner/boho-corner-gallery-03.jpg'],
      plans: ['projects/boho-corner/boho-corner-gallery-plan-1.jpg', 'projects/boho-corner/boho-corner-gallery-plan-2.jpg'],
      page: '../../projects/boho-corner.html',
      units: [
        u(1, 70.94, 2, 2, { terrace: 22.35, plan: 'projects/boho-corner/boho-corner-gallery-plan-1a.jpg' }),
        u(2, 72.44, 2, 2, { terrace: 9.9, plan: 'projects/boho-corner/boho-corner-gallery-plan-1b.jpg' }),
        u(3, 95.08, 3, 2, { plan: 'projects/boho-corner/boho-corner-gallery-plan-1c.jpg' }),
        u(4, 86.4, 3, 2, { terrace: 4.4, plan: 'projects/boho-corner/boho-corner-gallery-plan-1d.jpg' }),
        u(5, 99.61, 3, 2, { terrace: 107.04, duplex: true, plan: 'projects/boho-corner/boho-corner-gallery-plan-2a.jpg' }),
        u(6, 86.08, 2, 2, { terrace: 69.38, duplex: true, plan: 'projects/boho-corner/boho-corner-gallery-plan-2b.jpg' }),
        u(7, 102.65, 3, 2, { terrace: 74.89, duplex: true, plan: 'projects/boho-corner/boho-corner-gallery-plan-2c.jpg' }),
        u(8, 74.16, 2, 2, { terrace: 62.08, duplex: true, plan: 'projects/boho-corner/boho-corner-gallery-plan-2d.jpg' })
      ]
    }
  ];

  function fmtArea(n) { return (Math.round(n * 100) / 100).toLocaleString('en-GB', { maximumFractionDigits: 2 }) + ' m²'; }
  function outdoor(x) {
    if (x.garden) return { label: 'Garden', value: x.garden };
    if (x.terrace) return { label: 'Terrace', value: x.terrace };
    if (x.balcony) return { label: 'Balcony', value: x.balcony };
    return null;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  window.TID = {
    company: company, services: services, process: process, projects: projects,
    img: function (p) { return IMG_BASE + p; },
    project: function (id) { return projects.filter(function (p) { return p.id === id; })[0]; },
    fmtArea: fmtArea, outdoor: outdoor, esc: esc,
    reducedMotion: function () { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  };
})();
