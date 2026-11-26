// Chart builders for NusaAngka. Every chart is plain inline SVG drawn from
// the numbers in data.js — no library, no network, nothing fetched.

const INK = '#123f3a';
const TEAL = '#0e7a6d';
const AMBER = '#e8a13a';
const SAND = '#efe7d8';
const GRID = '#d9d2c2';
const MUTED = '#6b7268';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const size = nice * mag;
  const start = Math.floor(min / size) * size;
  const ticks = [];
  for (let v = start; v <= max + size * 0.001; v += size) ticks.push(v);
  return ticks;
}

// Horizontal bar chart: rows of {label, value, display, highlight}.
export function barChart(rows, opts = {}) {
  const width = opts.width || 720;
  const rowH = opts.rowHeight || 34;
  const labelW = opts.labelWidth || 150;
  const top = 8;
  const height = top + rows.length * rowH + 8;
  const max = Math.max(...rows.map((r) => r.value), 0.0001);
  const barMax = width - labelW - 86;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart" xmlns="http://www.w3.org/2000/svg">`;
  rows.forEach((r, i) => {
    const y = top + i * rowH;
    const w = Math.max(2, (r.value / max) * barMax);
    const fill = r.highlight ? AMBER : TEAL;
    out += `<text x="0" y="${y + 15}" font-size="13" fill="${INK}">${esc(r.label)}</text>`;
    out += `<rect x="${labelW}" y="${y + 2}" width="${w}" height="18" rx="4" fill="${fill}"/>`;
    out += `<text x="${labelW + w + 8}" y="${y + 16}" font-size="13" font-weight="600" fill="${INK}">${esc(r.display)}</text>`;
  });
  out += '</svg>';
  return out;
}

// Line chart over years: values aligned with the `years` array.
export function lineChart(years, values, opts = {}) {
  const width = opts.width || 720;
  const height = opts.height || 260;
  const padL = 52, padR = 14, padT = 14, padB = 30;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = min < 0 ? min * 1.15 : Math.max(0, min - (max - min) * 0.25);
  const hi = max + (max - min) * 0.12;
  const x = (i) => padL + (i * (width - padL - padR)) / (years.length - 1);
  const y = (v) => padT + ((hi - v) / (hi - lo)) * (height - padT - padB);
  const ticks = niceTicks(lo, hi, 4);
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Line chart, ${years[0]} to ${years[years.length - 1]}" xmlns="http://www.w3.org/2000/svg">`;
  ticks.forEach((t) => {
    out += `<line x1="${padL}" y1="${y(t)}" x2="${width - padR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>`;
    out += `<text x="${padL - 8}" y="${y(t) + 4}" font-size="11" text-anchor="end" fill="${MUTED}">${fmtTick(t)}</text>`;
  });
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  out += `<polygon points="${padL},${y(lo)} ${points} ${x(values.length - 1).toFixed(1)},${y(lo)}" fill="${TEAL}" opacity="0.10"/>`;
  out += `<polyline points="${points}" fill="none" stroke="${TEAL}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  values.forEach((v, i) => {
    out += `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#fff" stroke="${TEAL}" stroke-width="2.5"/>`;
    if (i === 0 || i === values.length - 1 || v === max || v === min) {
      out += `<text x="${x(i)}" y="${y(v) - 10}" font-size="12" font-weight="700" text-anchor="middle" fill="${INK}">${fmtTick(v)}</text>`;
    }
  });
  years.forEach((yr, i) => {
    if (i % 2 === 0 || i === years.length - 1) {
      out += `<text x="${x(i)}" y="${height - 8}" font-size="11" text-anchor="middle" fill="${MUTED}">${yr}</text>`;
    }
  });
  out += '</svg>';
  return out;
}

function fmtTick(v) {
  if (Math.abs(v) >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + 'k';
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

// Donut chart for shares that add to 100.
export function donutChart(slices, opts = {}) {
  const size = opts.size || 240;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, thick = 34;
  const colors = [TEAL, AMBER, '#7fb5ad'];
  let out = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Donut chart" xmlns="http://www.w3.org/2000/svg">`;
  let angle = -Math.PI / 2;
  slices.forEach((s, i) => {
    const frac = s.share / 100;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    out += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="${thick}"/>`;
    const mid = (a0 + a1) / 2;
    const lx = cx + (r + 26) * Math.cos(mid), ly = cy + (r + 26) * Math.sin(mid);
    out += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="12" font-weight="700" text-anchor="middle" fill="${INK}">${s.share}%</text>`;
    angle = a1;
  });
  out += `<text x="${cx}" y="${cy - 4}" font-size="22" font-weight="800" text-anchor="middle" fill="${INK}">${slices[1].share}%</text>`;
  out += `<text x="${cx}" y="${cy + 16}" font-size="11" text-anchor="middle" fill="${MUTED}">working age</text>`;
  out += '</svg>';
  return out;
}
