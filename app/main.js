// Router and boot for NusaAngka. Hash routes only — no server, no network:
// #/ home, #/compare, #/indicators, #/indicators/:key, #/indonesia,
// #/provinces, #/sources. Unknown routes fall back to the home page.

import { homeView, compareView, wireCompare, indicatorsView, indicatorView, indonesiaView, provincesView, wireProvinces, sourcesView } from './views.js';

const ROUTES = [
  { match: (p) => p === '' || p === '/', render: homeView },
  { match: (p) => p === '/compare', render: compareView, wire: wireCompare },
  { match: (p) => p === '/indicators', render: indicatorsView },
  { match: (p) => p.startsWith('/indicators/'), render: (p) => indicatorView(decodeURIComponent(p.slice('/indicators/'.length))) },
  { match: (p) => p === '/indonesia', render: indonesiaView },
  { match: (p) => p === '/provinces', render: provincesView, wire: wireProvinces },
  { match: (p) => p === '/sources', render: sourcesView },
];

function route() {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#/, '') || '/';
  const page = document.querySelector('#page');
  const found = ROUTES.find((r) => r.match(path));
  const render = found ? found.render : homeView;
  page.innerHTML = render(path);
  if (found && found.wire) found.wire(page);
  document.querySelectorAll('nav a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href === '#' + path || (path === '/' && href === '#/'));
  });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
