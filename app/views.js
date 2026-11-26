// Page renderers for NusaAngka. Each route is a function that returns the
// HTML for #page; main.js swaps it in and wires the controls. All figures
// come from data.js, every chart from charts.js.

import { NATIONS, MEASURES, DECADE, SPAN, AGE_BANDS, PROVINCES, HEADLINE, PUBLISHERS } from './data.js';
import { barChart, lineChart, donutChart } from './charts.js';
import { fmt, trim, group, rankOf, density } from './format.js';

const IDN = NATIONS.find((n) => n.code === 'IDN');

function sourceLine(origin) {
  return `<p class="src">Source: ${origin}</p>`;
}

function pageHead(kicker, title, intro) {
  return `<header class="pagehead"><p class="kicker">${kicker}</p><h1>${title}</h1><p class="lede">${intro}</p></header>`;
}

function statCard(h) {
  return `<article class="stat"><p class="stat-value">${h.value}</p><p class="stat-label">${h.label}</p><p class="stat-detail">${h.detail}</p><p class="stat-src">${h.origin}</p></article>`;
}

function measureCard(m) {
  const ranked = [...NATIONS].sort((a, b) => {
    if (!m.better) return b.stats[m.key] - a.stats[m.key];
    return m.better === 'high' ? b.stats[m.key] - a.stats[m.key] : a.stats[m.key] - b.stats[m.key];
  });
  const leader = ranked[0];
  const idnRank = rankOf(IDN.stats[m.key], NATIONS.map((n) => n.stats[m.key]), m.better);
  const rankNote = idnRank ? `Indonesia ranks #${idnRank} of ${NATIONS.length}` : 'Indonesia: ' + fmt(IDN.stats[m.key], m.kind);
  return `<article class="card">
    <h3><a href="#/indicators/${m.key}">${m.name}</a></h3>
    <p class="big">${fmt(IDN.stats[m.key], m.kind)} <span class="unit">${m.unit}</span></p>
    <p>${m.about}</p>
    <p class="leader">Leader: <strong>${leader.name}</strong> — ${fmt(leader.stats[m.key], m.kind)}</p>
    <p class="ranknote">${rankNote}</p>
    <p><a class="morelink" href="#/indicators/${m.key}">See all ${NATIONS.length} countries →</a></p>
  </article>`;
}

// ---- Home -----------------------------------------------------------------

export function homeView() {
  const growth = DECADE.growth;
  const growthRows = SPAN.map((y, i) => ({ year: y, value: growth.values[i] }));
  const javaPop = PROVINCES.filter((p) => ['West Java', 'East Java', 'Central Java', 'Banten', 'Jakarta'].includes(p.name))
    .reduce((s, p) => s + p.pop, 0);
  const javaShare = ((javaPop / 281.6) * 100).toFixed(0);
  const topProvinces = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 5);
  const gdpRank = [...NATIONS].sort((a, b) => b.stats.gdp - a.stats.gdp);
  return `
  <section class="hero">
    <p class="kicker">Indonesia &amp; the region, in numbers</p>
    <h1>How big is Indonesia, really?</h1>
    <p class="lede">NusaAngka gathers the headline statistics of Indonesia and its neighbours — population, economy, health, connectivity — each figure traced to the World Bank or Statistics Indonesia (BPS), and each chart drawn from the numbers themselves.</p>
    <p class="hero-actions"><a class="btn" href="#/indonesia">Explore Indonesia's decade →</a> <a class="btn ghost" href="#/compare">Compare countries →</a></p>
  </section>

  <section aria-label="Indonesia today">
    <h2>Indonesia today</h2>
    <div class="statgrid">${HEADLINE.map(statCard).join('')}</div>
    ${sourceLine('Statistics Indonesia (BPS) and World Bank, World Development Indicators, 2024.')}
  </section>

  <section aria-label="Growth over a decade">
    <h2>A decade of growth</h2>
    <p>Real GDP growth, % per year, 2015–2024. The dip in 2020 is the pandemic; growth has held at 5% or above ever since.</p>
    ${lineChart(SPAN, growth.values)}
    ${sourceLine(growth.origin + '.')}
    <p><a class="morelink" href="#/indonesia">All seven decade series →</a></p>
  </section>

  <section aria-label="Where Indonesians live">
    <h2>Where Indonesians live</h2>
    <p>The five most populous provinces on Java hold <strong>${trim(javaPop)} million people — ${javaShare}% of the country</strong>. Jakarta, the smallest of the twelve, is by far the densest at ${group(density(10.6, 664))} people per km².</p>
    ${barChart(topProvinces.map((p) => ({ label: p.name, value: p.pop, display: `${trim(p.pop)}m`, highlight: p.name === 'West Java' })))}
    ${sourceLine('Statistics Indonesia (BPS), mid-year estimates, 2024.')}
    <p><a class="morelink" href="#/provinces">All twelve provinces, sortable →</a></p>
  </section>

  <section aria-label="Biggest economies nearby">
    <h2>The region's biggest economies</h2>
    <p>GDP, US$ billion, 2023. Indonesia is the largest economy in Southeast Asia and the ${gdpRank.findIndex((n) => n.code === 'IDN') + 1}th largest of the ${NATIONS.length} countries on this site.</p>
    ${barChart(gdpRank.slice(0, 6).map((n) => ({ label: n.name, value: n.stats.gdp, display: fmt(n.stats.gdp, 'billions'), highlight: n.code === 'IDN' })))}
    ${sourceLine('World Bank, World Development Indicators (2023).')}
    <p><a class="morelink" href="#/indicators/gdp">About the GDP measure →</a></p>
  </section>

  <section aria-label="Browse">
    <h2>Start exploring</h2>
    <div class="cardgrid">
      <article class="card"><h3><a href="#/compare">Compare countries</a></h3><p>Pick any of the ${NATIONS.length} countries and any measure, and see them side by side as a chart and a table.</p></article>
      <article class="card"><h3><a href="#/indicators">Six headline measures</a></h3><p>Population, GDP, GDP per person, life expectancy, people online and unemployment — what each one means and who leads.</p></article>
      <article class="card"><h3><a href="#/indonesia">Indonesia's decade</a></h3><p>Seven series from 2015 to 2024, plus the age structure of 281.6 million people.</p></article>
      <article class="card"><h3><a href="#/sources">Sources &amp; methods</a></h3><p>Where every number comes from, what each measure counts, and what this site does not claim.</p></article>
    </div>
  </section>`;
}

// ---- Compare ---------------------------------------------------------------

let compareSelection = ['IDN', 'MYS', 'SGP', 'THA'];
let compareMeasure = 'gdppc';

export function compareView() {
  const measure = MEASURES.find((m) => m.key === compareMeasure);
  const picked = NATIONS.filter((n) => compareSelection.includes(n.code));
  const rows = [...picked]
    .sort((a, b) => b.stats[measure.key] - a.stats[measure.key])
    .map((n) => ({ label: n.name, value: n.stats[measure.key], display: fmt(n.stats[measure.key], measure.kind), highlight: n.code === 'IDN' }));
  const checks = NATIONS.map((n) => `
    <label class="check"><input type="checkbox" data-code="${n.code}" ${compareSelection.includes(n.code) ? 'checked' : ''}> ${n.name}</label>`).join('');
  const options = MEASURES.map((m) => `<option value="${m.key}" ${m.key === compareMeasure ? 'selected' : ''}>${m.name} (${m.unit})</option>`).join('');
  const tableRows = [...picked]
    .sort((a, b) => b.stats[measure.key] - a.stats[measure.key])
    .map((n, i) => {
      const rank = rankOf(n.stats[measure.key], NATIONS.map((x) => x.stats[measure.key]), measure.better);
      return `<tr><td>${i + 1}</td><td><strong>${n.name}</strong></td><td>${n.region}</td><td>${fmt(n.stats[measure.key], measure.kind)}</td><td>${rank ? '#' + rank + ' of ' + NATIONS.length : '—'}</td></tr>`;
    }).join('');
  return `
  ${pageHead('Compare', 'Compare countries', 'Tick countries, pick a measure, and the chart and table follow. All figures are for 2023, from the World Bank\u2019s World Development Indicators.')}
  <div class="compare-controls">
    <fieldset><legend>Countries (${compareSelection.length} picked)</legend><div class="checks">${checks}</div></fieldset>
    <label class="measure-pick">Measure
      <select id="compare-measure">${options}</select>
    </label>
  </div>
  <p class="measure-about">${measure.about}</p>
  ${picked.length ? barChart(rows) : '<p class="empty">Tick at least one country to draw the chart.</p>'}
  ${picked.length ? `
  <table class="data-table">
    <thead><tr><th>#</th><th>Country</th><th>Region</th><th>${measure.name}</th><th>Rank of ${NATIONS.length}</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>` : ''}
  ${sourceLine(measure.origin + '.')}
  <p><a class="morelink" href="#/indicators/${measure.key}">Read about this measure →</a></p>`;
}

export function wireCompare(root) {
  root.querySelectorAll('input[data-code]').forEach((box) => {
    box.addEventListener('change', () => {
      compareSelection = [...root.querySelectorAll('input[data-code]:checked')].map((b) => b.dataset.code);
      rerenderCompare();
    });
  });
  const select = root.querySelector('#compare-measure');
  if (select) {
    select.addEventListener('change', () => {
      compareMeasure = select.value;
      rerenderCompare();
    });
  }
}

function rerenderCompare() {
  const page = document.querySelector('#page');
  if (!page) return;
  page.innerHTML = compareView();
  wireCompare(page);
}

// ---- Indicators ------------------------------------------------------------

export function indicatorsView() {
  return `
  ${pageHead('Measures', 'Six headline measures', 'The six numbers this site compares across countries — what each one counts, who leads it, and where Indonesia stands. Every figure is for 2023.')}
  <div class="cardgrid">${MEASURES.map(measureCard).join('')}</div>
  ${sourceLine('World Bank, World Development Indicators (2023); unemployment uses the ILO modelled estimate.')}`;
}

export function indicatorView(key) {
  const m = MEASURES.find((x) => x.key === key);
  if (!m) return `<p class="empty">No measure named “${key}”. <a href="#/indicators">See all six measures →</a></p>`;
  const sorted = [...NATIONS].sort((a, b) => b.stats[m.key] - a.stats[m.key]);
  const best = m.better === 'low' ? sorted[sorted.length - 1] : sorted[0];
  const worst = m.better === 'low' ? sorted[0] : sorted[sorted.length - 1];
  const idnRank = rankOf(IDN.stats[m.key], NATIONS.map((n) => n.stats[m.key]), m.better);
  const rows = sorted.map((n) => {
    const rank = rankOf(n.stats[m.key], NATIONS.map((x) => x.stats[m.key]), m.better);
    return `<tr><td>${m.better ? rank : '—'}</td><td><strong>${n.name}</strong></td><td>${n.region}</td><td>${fmt(n.stats[m.key], m.kind)}</td></tr>`;
  }).join('');
  return `
  ${pageHead('Measure', m.name, m.about)}
  <p class="factline">Highest: <strong>${best.name}</strong> (${fmt(best.stats[m.key], m.kind)}) · Lowest: <strong>${worst.name}</strong> (${fmt(worst.stats[m.key], m.kind)}) · Indonesia: <strong>${fmt(IDN.stats[m.key], m.kind)}</strong>${idnRank ? ` — #${idnRank} of ${NATIONS.length}` : ''}.</p>
  ${barChart(sorted.map((n) => ({ label: n.name, value: n.stats[m.key], display: fmt(n.stats[m.key], m.kind), highlight: n.code === 'IDN' })))}
  <table class="data-table">
    <thead><tr><th>Rank</th><th>Country</th><th>Region</th><th>${m.name} (${m.unit})</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  ${sourceLine(m.origin + '.')}
  <p><a class="morelink" href="#/compare">Compare these countries yourself →</a> · <a class="morelink" href="#/indicators">All six measures →</a></p>`;
}

// ---- Indonesia's decade ----------------------------------------------------

export function indonesiaView() {
  const series = Object.entries(DECADE).map(([key, s]) => {
    const first = s.values[0];
    const last = s.values[s.values.length - 1];
    const change = (((last - first) / Math.abs(first)) * 100).toFixed(1);
    return `<section class="series" aria-label="${s.name}">
      <h3>${s.name} <span class="unit">(${s.unit})</span></h3>
      <p class="series-now">${fmt(last, kindFor(key))} <span class="series-change">in 2024, ${Number(change) >= 0 ? '+' : ''}${change}% since 2015</span></p>
      ${lineChart(SPAN, s.values)}
      <p>${s.story}</p>
      ${sourceLine(s.origin + '.')}
    </section>`;
  }).join('');
  return `
  ${pageHead('Indonesia', 'Indonesia\u2019s decade, 2015–2024', 'Seven series, ten years, one story: a large country that kept growing, got richer per person, and cut poverty — with a pandemic-shaped dent in the middle.')}
  <section aria-label="Age structure">
    <h2>Who Indonesians are</h2>
    <div class="split">
      <div>${donutChart(AGE_BANDS)}</div>
      <div>
        <p>Indonesia is young: <strong>68.2% of people are of working age (15–64)</strong>, and only 6.9% are 65 or older. That is the demographic dividend — more workers than dependants — and it lasts while the 24.9% who are children grow up.</p>
        <ul class="factlist">
          ${AGE_BANDS.map((a) => `<li><strong>${a.band}:</strong> ${a.share}% — ${a.words}.</li>`).join('')}
        </ul>
        ${sourceLine('Statistics Indonesia (BPS), 2024.')}
      </div>
    </div>
  </section>
  <section aria-label="Decade series"><h2>Seven series, 2015–2024</h2>${series}</section>
  <p><a class="morelink" href="#/provinces">See the provinces behind the national total →</a></p>`;
}

function kindFor(key) {
  if (key === 'output') return 'billions';
  if (key === 'growth' || key === 'prices' || key === 'poverty') return 'percent';
  if (key === 'people') return 'millions';
  if (key === 'lifespan') return 'years';
  if (key === 'income') return 'dollars';
  return 'millions';
}

// ---- Provinces -------------------------------------------------------------

export function provincesView() {
  const total = PROVINCES.reduce((s, p) => s + p.pop, 0);
  const rows = [...PROVINCES].sort((a, b) => b.pop - a.pop).map((p, i) => `
    <tr><td>${i + 1}</td><td><strong>${p.name}</strong></td><td>${p.capital}</td><td>${trim(p.pop)}m</td><td>${((p.pop / 281.6) * 100).toFixed(1)}%</td><td>${group(density(p.pop, p.areaKm2))}</td></tr>`).join('');
  return `
  ${pageHead('Provinces', 'Twelve provinces, one country', 'The twelve most populous provinces hold ${trim(total)} million people — ${((total / 281.6) * 100).toFixed(0)}% of Indonesia. Use the search box to find a province, or click a column heading to sort the table.')}
  <p class="controls"><label>Search provinces <input id="prov-search" type="search" placeholder="e.g. Java" aria-label="Search provinces"></label></p>
  ${barChart([...PROVINCES].sort((a, b) => b.pop - a.pop).map((p) => ({ label: p.name, value: p.pop, display: `${trim(p.pop)}m`, highlight: p.name === 'Jakarta' })))}
  <table class="data-table" id="prov-table">
    <thead><tr><th data-sort="rank">#</th><th data-sort="name">Province</th><th data-sort="capital">Capital</th><th data-sort="pop">Population</th><th data-sort="share">Share of Indonesia</th><th data-sort="density">People / km²</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  ${sourceLine('Statistics Indonesia (BPS), mid-year estimates, 2024. Density is computed from population and area.')}
  <p><a class="morelink" href="#/indonesia">Back to Indonesia\u2019s decade →</a></p>`;
}

export function wireProvinces(root) {
  const input = root.querySelector('#prov-search');
  const table = root.querySelector('#prov-table');
  if (!input || !table) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    table.querySelectorAll('tbody tr').forEach((tr) => {
      tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
  let asc = false;
  table.querySelectorAll('th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      const body = table.querySelector('tbody');
      const rows = [...body.querySelectorAll('tr')];
      const col = [...th.parentElement.children].indexOf(th);
      asc = !asc;
      rows.sort((a, b) => {
        const av = a.children[col].textContent.trim();
        const bv = b.children[col].textContent.trim();
        const an = parseFloat(av.replace(/[^0-9.]/g, ''));
        const bn = parseFloat(bv.replace(/[^0-9.]/g, ''));
        if (!Number.isNaN(an) && !Number.isNaN(bn) && av !== bv) return asc ? an - bn : bn - an;
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
      rows.forEach((r) => body.appendChild(r));
    });
  });
}

// ---- Sources ---------------------------------------------------------------

export function sourcesView() {
  return `
  ${pageHead('Sources', 'Sources &amp; methods', 'A statistics site is only as good as its sources. Here is where every number on NusaAngka comes from, what each measure counts, and the limits of what the site claims.')}
  <section aria-label="Publishers">
    <h2>Publishers</h2>
    <table class="data-table">
      <thead><tr><th>Publisher</th><th>What it supplies</th><th>Years</th></tr></thead>
      <tbody>${PUBLISHERS.map((p) => `<tr><td><strong>${p.name}</strong></td><td>${p.covers}</td><td>${p.years}</td></tr>`).join('')}</tbody>
    </table>
  </section>
  <section aria-label="What each measure counts">
    <h2>What each measure counts</h2>
    <dl class="defs">
      ${MEASURES.map((m) => `<div><dt>${m.name} (${m.unit})</dt><dd>${m.about} ${m.origin}.</dd></div>`).join('')}
    </dl>
  </section>
  <section aria-label="Methods and limits">
    <h2>Methods &amp; limits</h2>
    <ul class="factlist">
      <li><strong>No fetching.</strong> Every figure is stored in the site\u2019s own files; the site makes no network request at all, so the numbers you see are the numbers as published for the years stated.</li>
      <li><strong>Density is computed</strong> from each province\u2019s population and land area, and shares of Indonesia are computed from the 2024 mid-year population of 281.6 million.</li>
      <li><strong>Ranks are within this site\u2019s ${NATIONS.length} countries</strong>, not the world. “#1 of ${NATIONS.length}” means first among the countries compared here.</li>
      <li><strong>2024 GDP per person</strong> is the World Bank estimate; the 2024 population is the BPS mid-year estimate. Both are labelled as estimates where they appear.</li>
      <li><strong>Unemployment is a modelled estimate</strong> (ILO), not a census count, and definitions of “seeking work” differ between countries.</li>
      <li><strong>Figures are rounded</strong> for reading (one decimal place, or whole dollars). Underlying values are the published ones.</li>
    </ul>
  </section>
  <section aria-label="About this site">
    <h2>About NusaAngka</h2>
    <p>NusaAngka — “nusa” for archipelago, “angka” for number — is an independent site built for the make.fun best-national-statistics-site bounty. It is not affiliated with Statistics Indonesia, the World Bank, or the ILO; their names appear only as the sources of the figures quoted.</p>
    <p>Built as static files: no build step, no tracking, no network requests. The code is public on GitHub under the MIT licence.</p>
  </section>`;
}
