/** glow.js — أيقونات إضافية + تدرّج/توهّج للأيقونات + مخطط خطي صغير */
import { ICONS } from './icons.js?v=20261007-v12';

const S = p => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true">${p}</svg>`;

// أيقونات إضافية (لا تستبدل الموجود)
const EXTRA = {
  youtube: S('<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3V9Z"/>'),
  gift: S('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-2-4-6-3-5 0 .5 1.5 3 1 5 0Zm0 0c2-4 6-3 5 0-.5 1.5-3 1-5 0Z"/>'),
  headphones: S('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>'),
  keyboard: S('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'),
  shoppingBag: S('<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  search: S('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
  star: S('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/>'),
  shield: S('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>'),
  lock: S('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  users: S('<circle cx="9" cy="8" r="3.5"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 21v-1a6 6 0 0 0-4-5.6"/>'),
  heart: S('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7 7-7Z"/>'),
  zap: S('<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>'),
  award: S('<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>'),
  map: S('<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14"/>'),
  phone: S('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>'),
  mail: S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  bell: S('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8ZM10 21h4"/>'),
  eye: S('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),
  bot: S('<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 14h.01M15 14h.01M2 14h2M20 14h2"/>'),
  book: S('<path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V3Z"/><path d="M5 19a2 2 0 0 1 2-2h12"/>'),
  bookmark: S('<path d="M6 3h12v18l-6-4-6 4V3Z"/>'),
  link: S('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  layers: S('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>'),
  sliders: S('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),
  plus: S('<path d="M12 5v14M5 12h14"/>'),
  minus: S('<path d="M5 12h14"/>'),
  chevronDown: S('<path d="m6 9 6 6 6-6"/>'),
  chevronLeft: S('<path d="m15 6-6 6 6 6"/>'),
  chevronRight: S('<path d="m9 6 6 6-6 6"/>'),
  externalLink: S('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  fileText: S('<path d="M6 3h8l5 5v13H6V3Z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>'),
  school: S('<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v6h12v-6M12 14v7"/>'),
  microscope: S('<path d="M6 21h12M9 17h6M10 3l4 2-3 8-4-2 3-8ZM14 9a5 5 0 0 1 0 8"/>'),
  code: S('<path d="m8 9-4 3 4 3M16 9l4 3-4 3"/>')
};
Object.entries(EXTRA).forEach(([k, v]) => { if (!ICONS[k]) ICONS[k] = v; });

// تدرّجات مشتركة (مرجع للأيقونات والمخطط الخطي)
export function injectGlowDefs() {
  if (document.getElementById('icoDefs')) return;
  const d = document.createElement('div');
  d.id = 'icoDefs';
  d.setAttribute('aria-hidden', 'true');
  d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  d.innerHTML = `<svg width="0" height="0"><defs>
    <linearGradient id="icg" gradientUnits="userSpaceOnUse" x1="3" y1="3" x2="21" y2="21">
      <stop offset="0" stop-color="#7df3ff"/><stop offset=".55" stop-color="#4f8cff"/><stop offset="1" stop-color="#9a7bff"/></linearGradient>
    <linearGradient id="sgr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7df3ff"/><stop offset="1" stop-color="#4f6bff"/></linearGradient>
  </defs></svg>`;
  document.body.prepend(d);
}

// مخطط خطي صغير حتمي (يعتمد على معرّف التخصص ونسبته)
export function sparkline(score = 50, seed = 'x', w = 92, h = 30) {
  let s = 0;
  for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const n = 16, pts = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const v = Math.max(0, Math.min(1, 0.22 + 0.6 * t * (score / 100) + (rnd() - 0.5) * 0.3));
    pts.push(`${(t * w).toFixed(1)} ${(h - 3 - v * (h - 6)).toFixed(1)}`);
  }
  return `<svg class="sp" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="M${pts.join(' L')}" fill="none" stroke="url(#sgr)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
