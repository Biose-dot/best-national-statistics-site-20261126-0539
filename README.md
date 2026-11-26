# NusaAngka — Indonesia &amp; the region in numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Biose-dot/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Biose-dot/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

**NusaAngka** — “nusa” for archipelago, “angka” for number — is a national
statistics site for Indonesia and its neighbours: 281.6 million people, a
US$1.40 trillion economy, ten countries compared on six measures, and every
figure traced to the publication it came from. It runs entirely from its own
files in `app/`, with no network request, on desktop and on a phone.

## What it shows

- **Home** — six headline figures for 2024 (population, GDP, growth, life
  expectancy, poverty, inflation), a decade of GDP growth as a line chart,
  the five most populous provinces on Java, and the region's biggest
  economies as a bar chart.
- **Compare countries** — pick any of ten countries (Indonesia, Malaysia,
  Singapore, Thailand, Vietnam, Philippines, Japan, South Korea, India,
  China) and any of six measures; the bar chart and ranked table follow at
  once. Indonesia is highlighted in amber on every chart.
- **Six headline measures** — one card per measure: what it counts, who
  leads it, and where Indonesia ranks. Each card opens a detail page with a
  full ranked chart and table.
- **Indonesia's decade** — seven series from 2015 to 2024 (GDP, growth,
  population, inflation, poverty, life expectancy, GDP per person), each with
  its own line chart, 2024 value, change since 2015, story and source — plus
  the age structure as a donut chart (68.2% of working age).
- **Provinces** — the twelve most populous provinces, 2024, in a table you
  can search and sort by any column (Jakarta: 15,964 people per km²; West
  Kalimantan: 39), with a bar chart above it.
- **Sources &amp; methods** — every publisher, what each measure counts, and
  the limits of what the site claims.

## The figures

Cross-country figures are the World Bank's World Development Indicators
(2023); Indonesia's decade series and provinces are Statistics Indonesia
(BPS), 2015–2024. Every figure names its source and year on the page where
it appears. Nothing is fetched at run time — the data ships in `app/data.js`.

## How it is built

- `app/index.html` — the shell: header, navigation, footer.
- `app/main.js` — the hash router (`#/`, `#/compare`, `#/indicators`,
  `#/indicators/:key`, `#/indonesia`, `#/provinces`, `#/sources`).
- `app/data.js` — every figure, with source and year.
- `app/charts.js` — hand-drawn SVG bar, line and donut charts; no library,
  no network.
- `app/views.js` — every page: home, compare, measures, decade, provinces,
  sources.
- `app/format.js` — number formatting and ranking helpers.
- `app/style.css` — warm paper, deep teal ink, amber accent; a phone layout
  under 640px.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library.

## Run it

```sh
node serve.ts            # app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` to `out/` and writes
`out/dossier.json` with the vendored make.fun library. The program is
deterministic: two runs write identical bytes.

---

<sub>Entered on [make.fun](https://make.fun/c/best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
