/**
 * Runtime icon patches, shared SVG gradients and the result-card sparkline.
 *
 * Must be imported after icons.js: it mutates the shared ICONS registry in place
 * (adds extra icons, replaces a few redrawn ones) and re-renders any static
 * `[data-icon]` placeholder that icons.js already painted with the old glyph.
 */
import { ICONS, getIcon } from './icons.js?v=1.1';

const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true">${inner}</svg>`;

// Additive only: a key that already exists in icons.js is never replaced.
const EXTRA_ICONS = {
  youtube: svg('<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3V9Z"/>'),
  gift: svg('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-2-4-6-3-5 0 .5 1.5 3 1 5 0Zm0 0c2-4 6-3 5 0-.5 1.5-3 1-5 0Z"/>'),
  headphones: svg('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>'),
  keyboard: svg('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'),
  shoppingBag: svg('<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
  star: svg('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/>'),
  shield: svg('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>'),
  lock: svg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  users: svg('<circle cx="9" cy="8" r="3.5"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 21v-1a6 6 0 0 0-4-5.6"/>'),
  heart: svg('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7 7-7Z"/>'),
  zap: svg('<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>'),
  award: svg('<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>'),
  map: svg('<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14"/>'),
  phone: svg('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  bell: svg('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8ZM10 21h4"/>'),
  eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),
  bot: svg('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 14h.01M15 14h.01M2 14h2M20 14h2"/>'),
  book: svg('<path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V3Z"/><path d="M5 19a2 2 0 0 1 2-2h12"/>'),
  bookmark: svg('<path d="M6 3h12v18l-6-4-6 4V3Z"/>'),
  link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  layers: svg('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>'),
  sliders: svg('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  minus: svg('<path d="M5 12h14"/>'),
  chevronDown: svg('<path d="m6 9 6 6 6-6"/>'),
  chevronLeft: svg('<path d="m15 6-6 6 6 6"/>'),
  chevronRight: svg('<path d="m9 6 6 6-6 6"/>'),
  externalLink: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  fileText: svg('<path d="M6 3h8l5 5v13H6V3Z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>'),
  school: svg('<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v6h12v-6M12 14v7"/>'),
  microscope: svg('<path d="M6 21h12M9 17h6M10 3l4 2-3 8-4-2 3-8ZM14 9a5 5 0 0 1 0 8"/>'),
  code: svg('<path d="m8 9-4 3 4 3M16 9l4 3-4 3"/>')
};
Object.entries(EXTRA_ICONS).forEach(([key, markup]) => {
  if (!ICONS[key]) ICONS[key] = markup;
});

// Redrawn glyphs that intentionally override the ones shipped in icons.js.
const REDRAWN_ICONS = {
  messageSquareText: svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/>'),
  rotateCcw: svg('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'),
  lightbulb: svg('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'),
  printer: svg('<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V2h12v7"/><rect x="6" y="14" width="12" height="8" rx="1"/>')
};
Object.assign(ICONS, REDRAWN_ICONS);
if (ICONS.cog) ICONS.settings2 = ICONS.cog;

// icons.js has already painted the static placeholders by the time this module
// runs, so repaint the ones whose glyph was just replaced.
if (typeof document !== 'undefined') {
  const replacedKeys = new Set([...Object.keys(REDRAWN_ICONS), 'settings2']);
  document.querySelectorAll('[data-icon]').forEach(el => {
    if (!replacedKeys.has(el.dataset.icon)) return;
    el.innerHTML = getIcon(el.dataset.icon, el.dataset.iconSize || 24, el.dataset.iconClass || '');
  });
}

/**
 * Injects the shared gradient defs once. `#icg` is the icon stroke gradient
 * (referenced from glow.css), `#sgr` the sparkline stroke.
 */
export function injectGlowDefs() {
  if (document.getElementById('icoDefs')) return;

  const holder = document.createElement('div');
  holder.id = 'icoDefs';
  holder.setAttribute('aria-hidden', 'true');
  holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  holder.innerHTML = `<svg width="0" height="0"><defs>
    <linearGradient id="icg" gradientUnits="userSpaceOnUse" x1="3" y1="3" x2="21" y2="21">
      <stop offset="0" stop-color="#7df3ff"/><stop offset=".55" stop-color="#4f8cff"/><stop offset="1" stop-color="#9a7bff"/></linearGradient>
    <linearGradient id="sgr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7df3ff"/><stop offset="1" stop-color="#4f6bff"/></linearGradient>
  </defs></svg>`;
  document.body.prepend(holder);
}

/**
 * Decorative sparkline for a specialization card. Deterministic: the same
 * (seed, score) always yields the same curve, via a string hash feeding a
 * linear congruential generator. Trend rises with score; jitter is cosmetic.
 */
export function sparkline(score = 50, seed = 'x', width = 92, height = 30) {
  let state = 0;
  for (const char of String(seed)) state = (state * 31 + char.charCodeAt(0)) >>> 0;
  const nextRandom = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const POINT_COUNT = 16;
  const points = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const t = i / (POINT_COUNT - 1);
    const value = Math.max(0, Math.min(1, 0.22 + 0.6 * t * (score / 100) + (nextRandom() - 0.5) * 0.3));
    points.push(`${(t * width).toFixed(1)} ${(height - 3 - value * (height - 6)).toFixed(1)}`);
  }

  return `<svg class="sp" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><path d="M${points.join(' L')}" fill="none" stroke="url(#sgr)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
