// Number formatting for NusaAngka — one place where every figure on the
// site gets its printed shape.

export function fmt(value, kind) {
  if (kind === 'millions') return `${trim(value)}m`;
  if (kind === 'billions') return `US$${trim(value)}bn`;
  if (kind === 'dollars') return `US$${group(Math.round(value))}`;
  if (kind === 'years') return `${trim(value)} yrs`;
  if (kind === 'percent') return `${trim(value)}%`;
  return String(value);
}

export function trim(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function group(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Rank of one value inside a list, 1-based, best first. `better` is 'high',
// 'low', or null (no ranking — the figure is a size, not a score).
export function rankOf(value, all, better) {
  if (!better) return null;
  const sorted = [...all].sort((a, b) => (better === 'high' ? b - a : a - b));
  return sorted.indexOf(value) + 1;
}

export function density(popMillion, areaKm2) {
  return Math.round((popMillion * 1e6) / areaKm2);
}
