// NusaAngka's figures. Every number in this file is a published statistic:
// cross-country figures are the World Bank's World Development Indicators
// (2023), Indonesia's decade series and provinces are Statistics Indonesia
// (BPS), 2015-2024. Each figure is shown next to its source and year on the
// site itself. Nothing here is fetched at run time — the site ships this
// file and reads it locally.

export const SPAN = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Eleven economies of Asia-Pacific, compared on the same six headline
// measures. All values are for 2023 unless a page says otherwise.
export const NATIONS = [
  { code: 'IDN', name: 'Indonesia', short: 'ID', region: 'Southeast Asia',
    stats: { pop: 277.5, gdp: 1371, gdppc: 4940, life: 68.0, net: 66.5, jobless: 3.4 } },
  { code: 'MYS', name: 'Malaysia', short: 'MY', region: 'Southeast Asia',
    stats: { pop: 34.1, gdp: 400, gdppc: 11758, life: 75.7, net: 96.9, jobless: 3.9 } },
  { code: 'SGP', name: 'Singapore', short: 'SG', region: 'Southeast Asia',
    stats: { pop: 6.0, gdp: 501, gdppc: 84821, life: 84.1, net: 96.4, jobless: 3.7 } },
  { code: 'THA', name: 'Thailand', short: 'TH', region: 'Southeast Asia',
    stats: { pop: 71.8, gdp: 515, gdppc: 7171, life: 76.4, net: 88.0, jobless: 1.0 } },
  { code: 'VNM', name: 'Vietnam', short: 'VN', region: 'Southeast Asia',
    stats: { pop: 98.9, gdp: 430, gdppc: 4346, life: 75.2, net: 79.1, jobless: 2.1 } },
  { code: 'PHL', name: 'Philippines', short: 'PH', region: 'Southeast Asia',
    stats: { pop: 117.3, gdp: 437, gdppc: 3725, life: 72.2, net: 75.4, jobless: 2.2 } },
  { code: 'JPN', name: 'Japan', short: 'JP', region: 'East Asia',
    stats: { pop: 124.5, gdp: 4213, gdppc: 33834, life: 84.0, net: 82.9, jobless: 2.6 } },
  { code: 'KOR', name: 'South Korea', short: 'KR', region: 'East Asia',
    stats: { pop: 51.7, gdp: 1723, gdppc: 33121, life: 83.4, net: 97.5, jobless: 2.7 } },
  { code: 'IND', name: 'India', short: 'IN', region: 'South Asia',
    stats: { pop: 1428.6, gdp: 3568, gdppc: 2502, life: 67.7, net: 48.9, jobless: 4.2 } },
  { code: 'CHN', name: 'China', short: 'CN', region: 'East Asia',
    stats: { pop: 1411.8, gdp: 17795, gdppc: 12614, life: 78.2, net: 76.9, jobless: 4.6 } },
];

// The six headline measures, each with its unit, how to read it and where
// the number comes from.
export const MEASURES = [
  { key: 'pop', name: 'Population', unit: 'million people', kind: 'millions', better: null,
    origin: 'World Bank, World Development Indicators (2023)',
    about: 'How many people live in the country — the denominator behind almost every other statistic on this site.' },
  { key: 'gdp', name: 'Gross domestic product', unit: 'US$ billion', kind: 'billions', better: null,
    origin: 'World Bank, World Development Indicators (2023)',
    about: 'The market value of everything produced in a year, in current US dollars.' },
  { key: 'gdppc', name: 'GDP per person', unit: 'US$', kind: 'dollars', better: 'high',
    origin: 'World Bank, World Development Indicators (2023)',
    about: 'GDP divided by population. A rough gauge of average income — not of how that income is shared.' },
  { key: 'life', name: 'Life expectancy', unit: 'years', kind: 'years', better: 'high',
    origin: 'World Bank, World Development Indicators (2023)',
    about: 'How long a newborn could expect to live if today\u2019s mortality patterns stayed as they are.' },
  { key: 'net', name: 'People online', unit: '% of population', kind: 'percent', better: 'high',
    origin: 'World Bank, World Development Indicators (2023)',
    about: 'The share of people who used the internet in the last three months.' },
  { key: 'jobless', name: 'Unemployment', unit: '% of labour force', kind: 'percent', better: 'low',
    origin: 'World Bank, World Development Indicators (2023); ILO modelled estimate',
    about: 'The share of the labour force without work but available for and seeking it.' },
];

// Indonesia, 2015-2024: one decade, seven series. Sources differ per series
// and are printed under each chart.
export const DECADE = {
  output: { name: 'GDP', unit: 'US$ billion', origin: 'World Bank, World Development Indicators, 2015–2024',
    values: [861, 932, 1016, 1043, 1119, 1059, 1186, 1319, 1371, 1400],
    story: 'Nominal GDP in current US dollars. It passed US$1 trillion in 2017 and US$1.4 trillion in 2024.' },
  growth: { name: 'GDP growth', unit: '% per year', origin: 'Statistics Indonesia (BPS), 2015–2024',
    values: [4.9, 5.0, 5.1, 5.2, 5.0, -2.1, 3.7, 5.3, 5.1, 5.0],
    story: 'Real GDP growth. The 2020 contraction is the COVID-19 pandemic; growth returned above 5% in 2022.' },
  people: { name: 'Population', unit: 'million people', origin: 'Statistics Indonesia (BPS) / World Bank WDI, 2015–2024',
    values: [258.2, 261.1, 264.0, 266.9, 269.6, 271.7, 273.8, 275.8, 277.5, 281.6],
    story: 'Mid-year population. Growth has slowed from about 1.3% a year in 2015 to under 1% in 2024.' },
  prices: { name: 'Inflation (CPI)', unit: '% per year', origin: 'Statistics Indonesia (BPS), 2015–2024',
    values: [3.4, 3.0, 3.6, 3.1, 2.7, 1.7, 1.9, 5.5, 2.6, 1.6],
    story: 'Consumer price inflation, annual average. The 2022 spike followed the subsidised-fuel price rise.' },
  poverty: { name: 'Poverty rate', unit: '% of population', origin: 'Statistics Indonesia (BPS), 2015–2024',
    values: [11.2, 10.9, 10.6, 9.8, 9.4, 10.2, 10.1, 9.6, 9.4, 9.0],
    story: 'Share of people below the national poverty line. The pandemic pushed it back above 10% in 2020–2021.' },
  lifespan: { name: 'Life expectancy', unit: 'years', origin: 'World Bank, World Development Indicators, 2015–2024',
    values: [66.7, 66.9, 67.1, 67.3, 67.5, 67.6, 67.0, 67.7, 68.0, 68.2],
    story: 'Life expectancy at birth. The 2021 dip is the pandemic mortality shock.' },
  income: { name: 'GDP per person', unit: 'US$', origin: 'World Bank, World Development Indicators, 2015–2024',
    values: [3369, 3603, 3840, 3893, 4176, 3907, 4294, 4788, 4940, 4960],
    story: 'Nominal GDP per person in current US dollars. It passed US$4,000 in 2019 and US$4,900 in 2023.' },
};

// Who Indonesians are, by age — shares of the total population, 2024 (BPS).
export const AGE_BANDS = [
  { band: '0–14 years', share: 24.9, words: 'about 70 million children' },
  { band: '15–64 years', share: 68.2, words: 'about 192 million of working age' },
  { band: '65+ years', share: 6.9, words: 'about 19 million older people' },
];

// The twelve most populous provinces, 2024 (BPS mid-year estimates).
// Density is computed on the page from population and area.
export const PROVINCES = [
  { name: 'West Java', capital: 'Bandung', pop: 50.3, areaKm2: 35378 },
  { name: 'East Java', capital: 'Surabaya', pop: 41.8, areaKm2: 47803 },
  { name: 'Central Java', capital: 'Semarang', pop: 37.9, areaKm2: 32801 },
  { name: 'North Sumatra', capital: 'Medan', pop: 16.0, areaKm2: 72981 },
  { name: 'Banten', capital: 'Serang', pop: 12.4, areaKm2: 9663 },
  { name: 'Jakarta', capital: 'Jakarta', pop: 10.6, areaKm2: 664 },
  { name: 'South Sulawesi', capital: 'Makassar', pop: 9.5, areaKm2: 46717 },
  { name: 'Lampung', capital: 'Bandar Lampung', pop: 9.4, areaKm2: 34624 },
  { name: 'South Sumatra', capital: 'Palembang', pop: 9.0, areaKm2: 91592 },
  { name: 'Riau', capital: 'Pekanbaru', pop: 6.9, areaKm2: 87024 },
  { name: 'West Kalimantan', capital: 'Pontianak', pop: 5.8, areaKm2: 147307 },
  { name: 'West Sumatra', capital: 'Padang', pop: 5.8, areaKm2: 42013 },
];

// The six numbers on the home page, each with its own source and year.
export const HEADLINE = [
  { value: '281.6m', label: 'People', detail: 'Mid-year population, 2024', origin: 'BPS' },
  { value: 'US$1.40tn', label: 'GDP', detail: 'Gross domestic product, 2024', origin: 'World Bank' },
  { value: '5.0%', label: 'GDP growth', detail: 'Real growth, 2024', origin: 'BPS' },
  { value: '68.2 yrs', label: 'Life expectancy', detail: 'At birth, 2024', origin: 'World Bank' },
  { value: '9.0%', label: 'Poverty rate', detail: 'Below the poverty line, 2024', origin: 'BPS' },
  { value: '1.6%', label: 'Inflation', detail: 'Consumer prices, 2024', origin: 'BPS' },
];

export const PUBLISHERS = [
  { name: 'Statistics Indonesia (BPS)', covers: 'Population, GDP growth, inflation, poverty, provinces', years: '2015–2024' },
  { name: 'World Bank, World Development Indicators', covers: 'Cross-country comparison, GDP, GDP per person, life expectancy, internet use, unemployment', years: '2015–2024' },
  { name: 'International Labour Organization', covers: 'Modelled unemployment estimates behind the World Bank series', years: '2023' },
];
