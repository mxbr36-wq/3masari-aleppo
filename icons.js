/**
 * icons.js
 *
 * نظام أيقونات SVG لمشروع "مساري".
 *
 * - 61 أيقونة SVG بأسلوب Lucide Icons
 * - Outline style: stroke=2
 * - ViewBox موحّد: 0 0 24 24
 * - الألوان عبر currentColor
 * - لا توجد مكتبات أو imports خارجية
 *
 * الاستخدام:
 *   import { getIcon, renderIcons } from './icons.js';
 *   const html = getIcon('brain', 24, 'icon-primary');
 *   renderIcons();
 *
 * في HTML:
 *   <span data-icon="brain" data-icon-size="24"></span>
 */

export const ICONS = {
  // ============ الأبعاد السبعة ============
  brain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M9 3.5A3.5 3.5 0 0 0 5.5 7v.5A3.5 3.5 0 0 0 3 11a3.5 3.5 0 0 0 2.5 3.36V16a3.5 3.5 0 0 0 5 3.16A3.5 3.5 0 0 0 15.5 16v-.5A3.5 3.5 0 0 0 18 12a3.5 3.5 0 0 0-2.5-3.36V7a3.5 3.5 0 0 0-5-3.16A3.5 3.5 0 0 0 9 3.5Z"/><path d="M9 4v16M5.5 8.5A3 3 0 0 1 9 11M15.5 8.5A3 3 0 0 0 12 11M5.5 14A3 3 0 0 1 9 12M15.5 14A3 3 0 0 0 12 12"/></svg>`,
  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z"/><path d="m19 13-.8 2.2L16 16l2.2.8L19 19l.8-2.2L22 16l-2.2-.8L19 13ZM5 14l-.7 2.3L2 17l2.3.7L5 20l.7-2.3L8 17l-2.3-.7L5 14Z"/></svg>`,
  messagesSquare: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M21 11.5a7.5 7.5 0 0 1-8.2 7.45L8 21l1.4-3.5A7.5 7.5 0 1 1 21 11.5Z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>`,
  cpu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
  clipboardList: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 9h6M9 13h6M9 17h4"/></svg>`,
  rocket: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M14 4c2.8-2.8 6-2.5 6-2.5s.3 3.2-2.5 6L13 12l-1 4-4-4 4-1 2-7Z"/><path d="M9 15 5 19M5 15l4 4M7 7l-3 3 5 2"/></svg>`,
  heartHandshake: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m12 20-8-7.2A5.2 5.2 0 0 1 11.4 5L12 5.6 12.6 5A5.2 5.2 0 0 1 20 12.8L12 20Z"/><path d="m8 11 2 2 2-2 2 2 2-2"/></svg>`,

  // ============ الاتجاهات الخمسة ============
  stethoscope: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M6 3v6a4 4 0 0 0 8 0V3M4 3h4M12 3h4M10 19a5 5 0 0 0 10 0v-2"/><circle cx="19" cy="14" r="3"/></svg>`,
  hardHat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M4 18h16"/><path d="M6 18v-4a6 6 0 0 1 12 0v4"/><path d="M3 14h18"/><path d="M12 8v6"/></svg>`,
  briefcase: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>`,
  usersRound: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  drama: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12 3 9 7l3 4 3-4-3-4Z"/><path d="M5 8 2 12l3 4 3-4-3-4ZM19 8l-3 4 3 4 3-4-3-4Z"/><path d="M7 20h10M9 16l3 4 3-4"/></svg>`,

  // ============ التخصصات الـ 31 ============
  heartPulse: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M20.8 8.5A5.4 5.4 0 0 0 12 5.1 5.4 5.4 0 0 0 3.2 8.5C1.2 14 7.2 18 12 21c4.8-3 10.8-7 8.8-12.5Z"/><path d="M3 12h4l2-3 3 6 2-3h7"/></svg>`,
  tooth: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M6.5 3.5C8.8 2.5 10.4 4 12 4s3.2-1.5 5.5-.5c2.2 1 2.2 4.2 1.2 7.2-.8 2.4-1.7 6.8-3.5 9.3-.7 1-2.2.6-2.5-.6L12 15l-.7 4.4c-.3 1.2-1.8 1.6-2.5.6-1.8-2.5-2.7-6.9-3.5-9.3-1-3-1-6.2 1.2-7.2Z"/></svg>`,
  pill: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m8 8 8 8"/><path d="M7 3h0a4 4 0 0 1 4 4v2H3V7a4 4 0 0 1 4-4ZM17 13h0a4 4 0 0 1 4 4v2h-8v-2a4 4 0 0 1 4-4Z" transform="rotate(45 12 12)"/></svg>`,
  syringe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m18 2 4 4M17 7l-4-4M3 21l5-5M6 18l-3-3"/><path d="m7 17 10-10 4 4L11 21H7v-4Z"/><path d="m14 10 2 2M10 14l2 2"/></svg>`,
  pawPrint: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M8 11c-2 0-4 2-4 4 0 2 1.5 3 3 3 1.3 0 2.1-.7 3-.7s1.7.7 3 .7c1.5 0 3-1 3-3 0-2-2-4-4-4-1 0-1.5.5-2 .5S9 11 8 11Z"/><circle cx="5.5" cy="7" r="2"/><circle cx="9.5" cy="4.5" r="2"/><circle cx="14.5" cy="4.5" r="2"/><circle cx="18.5" cy="7" r="2"/></svg>`,
  binary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 6h4M14 18h-4M6 10v4M18 10v4M10 18h4M6 18v-4M18 6V3h-4"/></svg>`,
  codeXml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>`,
  construction: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m14 6 4 4M3 21l8-8M13 5l6 6M4 20l3 1 10-10-4-4L3 17l1 3Z"/><path d="M14 4 16 2l6 6-2 2"/></svg>`,
  ruler: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M3 3h18v18H3z"/><path d="M7 3v4M11 3v2M15 3v4M19 3v2M3 7h4M3 11h2M3 15h4M3 19h2"/></svg>`,
  settings2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.4 1.4-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-2v-.5a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.4-1.4.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 10.9a1.7 1.7 0 0 0-.34-1.88L9 8.96l1.4-1.4.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.37 6.4V6h2v.4a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.4 1.4-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.5v2h-.5A1.7 1.7 0 0 0 19.4 15Z"/></svg>`,
  wheat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12 22V5"/><path d="M12 9c-4 0-6-2-6-5 4 0 6 2 6 5ZM12 14c4 0 6-2 6-5-4 0-6 2-6 5ZM12 18c-4 0-6-2-6-5 4 0 6 2 6 5ZM12 6c4 0 6-2 6-5-4 0-6 2-6 5Z"/></svg>`,
  flaskConical: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M9 3h6M10 3v5l-5.5 9.2A2.5 2.5 0 0 0 6.6 21h10.8a2.5 2.5 0 0 0 2.1-3.8L14 8V3"/><path d="M8 14h8"/></svg>`,
  laptop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20M7 20l1-2h8l1 2"/></svg>`,
  trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M3 17 9 11l4 4 8-9"/><path d="M15 6h6v6"/></svg>`,
  clipboardCheck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8 12l2 2 5-5M9 17h6"/></svg>`,
  calculator: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2"/></svg>`,
  landmark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m3 10 9-6 9 6H3Z"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/></svg>`,
  banknote: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 10h.01M18 14h.01"/></svg>`,
  megaphone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3Z"/><path d="M6 15v4a2 2 0 0 0 2 2h1l1-6M21 10v4"/></svg>`,
  newspaper: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`,
  graduationCap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/></svg>`,
  handHeart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M11 12 8.5 9.5a2.1 2.1 0 0 0-3 3L10 17a4 4 0 0 0 5.7 0l4.8-4.8a2.1 2.1 0 0 0-3-3L15 11.7"/><path d="M12 7 10.7 5.7a2.4 2.4 0 0 0-3.4 3.4L12 13l4.7-4.7a2.4 2.4 0 0 0-3.4-3.4L12 6.2"/><path d="M2 14l3 3M22 14l-3 3"/></svg>`,
  scale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12 3v18M5 7h14M5 7l-3 7h6L5 7ZM19 7l-3 7h6l-3-7ZM8 21h8"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M3 5a3 3 0 0 1 3-2h5v17H6a3 3 0 0 0-3 2V5ZM21 5a3 3 0 0 0-3-2h-5v17h5a3 3 0 0 1 3 2V5Z"/></svg>`,
  plane: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m2 12 20-9-5 18-4-7-11-2Z"/><path d="m13 14 4-7-7 4"/></svg>`,
  feather: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M20.5 3.5C14 2 8 5 6 10l-3 8 8-3c5-2 8-8 9.5-11.5Z"/><path d="M3 21c3-5 7-8 12-11"/></svg>`,
  palette: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12 3C6.5 3 2 6.8 2 11.5S5.5 20 10 20h1.5c1.4 0 2.3-1.5 1.5-2.7-.7-1.2.2-2.7 1.6-2.7H16c3.3 0 6-2.7 6-6C22 5.8 17.5 3 12 3Z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10" cy="7.5" r=".8"/><circle cx="14" cy="7" r=".8"/><circle cx="17" cy="10" r=".8"/></svg>`,
  paintbrush: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m14 4 6 6-8 8-6-6 8-8Z"/><path d="m6 12-3 3a3 3 0 0 0 4 4l3-3"/><path d="M17 7 20 4"/></svg>`,
  scroll: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M6 3h13v18H6a3 3 0 0 1 0-6h13"/><path d="M6 15a3 3 0 0 1 0-6h13M10 7h5M10 11h5"/></svg>`,
  library: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M4 19V5M9 19V5M15 19V5M20 19V5M2 21h20M3 3h18l-9-2-9 2Z"/></svg>`,

  // ============ أيقونات الواجهة ============
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
  loader2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.7-8.7"/><path d="M21 3v6h-6"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  messageSquareText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H6l-3 2 1.2-4.2A8 8 0 1 1 21 12Z"/><path d="M8 10h8M8 14h5"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>`,
  share2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`,
  rotateCcw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>`,
  printer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/><path d="M18 12h.01"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z"/></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>`,
  xCircle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>`,

};

export function getIcon(key, size = 24, className = '') {
  const svg = ICONS[key];

  if (!svg) {
    console.warn(`Icon not found: ${key}`);
    return '';
  }

  return svg
    .replace(/\{SIZE\}/g, String(size))
    .replace(/\{CLASS\}/g, String(className));
}

export function renderIcons(root = document) {
  if (!root || typeof root.querySelectorAll !== 'function') return;

  root.querySelectorAll('[data-icon]').forEach((el) => {
    const key = el.dataset.icon;
    const size = el.dataset.iconSize || 24;
    const className = el.dataset.iconClass || '';

    if (!el.querySelector('svg')) {
      el.innerHTML = getIcon(key, size, className);
    }
  });
}

/* ============ نظام CSS للأيقونات ============ */

export const ICON_CSS = `
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}

.icon-sm  { width: 0.875em; height: 0.875em; }
.icon-md  { width: 1em;     height: 1em; }
.icon-lg  { width: 1.25em;  height: 1.25em; }
.icon-xl  { width: 1.5em;   height: 1.5em; }
.icon-2xl { width: 2em;     height: 2em; }
.icon-3xl { width: 3em;     height: 3em; }

.icon-primary   { stroke: var(--primary); }
.icon-secondary { stroke: var(--secondary); }
.icon-muted     { stroke: var(--muted); }
.icon-danger    { stroke: var(--danger); }

[data-icon] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

[data-icon] > svg {
  flex-shrink: 0;
}
`;

/* ============ دليل التحديثات ============ */

export const ICONS_UPDATE_GUIDE = `
1. إضافة أيقونة:
   أضف مفتاحاً جديداً داخل ICONS بنفس بنية SVG الحالية.

2. القواعد:
   - ViewBox يجب أن يبقى 0 0 24 24.
   - stroke يجب أن يكون currentColor.
   - stroke-width يساوي 2.
   - stroke-linecap و stroke-linejoin يساويان round.
   - لا تضف مكتبات أو imports خارجية.

3. استخدام مباشر:
   getIcon('brain', 32, 'icon-primary')

4. استخدام عبر DOM:
   <span data-icon="brain" data-icon-size="24"
         data-icon-class="icon-primary"></span>
   ثم:
   renderIcons();

5. تغيير الحجم:
   الحجم يمرر إلى width و height في SVG.
   ويمكن استخدام أصناف icon-sm إلى icon-3xl.

6. تغيير اللون:
   الأيقونات تستخدم currentColor، لذلك يمكن التحكم باللون
   عبر color أو أصناف stroke المخصصة.

7. تحديث DOM:
   renderIcons(root) يقبل عنصراً محدداً بدلاً من document،
   مثلاً:
   renderIcons(document.querySelector('.results'));

8. لا تُغيّر أسماء المفاتيح الحالية، لأن صفحات المشروع قد
   تعتمد عليها.
`;

ICONS.timer = ICONS.loader2;
ICONS.compass = ICONS.settings2;

ICONS.display = ICONS.laptop;

ICONS.clock = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
ICONS.target = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>`;
ICONS.user = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>`;
ICONS.calendar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>`;
ICONS.barChart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>`;
ICONS.lightbulb = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3Z"/></svg>`;

ICONS.home = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>`;

/**
 * تفعيل العرض تلقائياً عند تحميل DOM.
 * يمكن تعطيله بعد الاستيراد إذا كان المشروع يدير العرض يدوياً.
 */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderIcons());
  } else {
    renderIcons();
  }
}

/* مراجعة الأيقونات v2.6 */
ICONS.stethoscope = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/></svg>`;
ICONS.hardHat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/></svg>`;
ICONS.heartPulse = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`;
ICONS.pill = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`;
ICONS.syringe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>`;
ICONS.pawPrint = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>`;
ICONS.binary = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4"/><path d="M14 10h4"/><path d="M6 14h2v6"/><path d="M14 4h2v6"/></svg>`;
ICONS.codeXml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`;
ICONS.laptop = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>`;
ICONS.trendingUp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></svg>`;
ICONS.calculator = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M16 14v4"/><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/></svg>`;
ICONS.banknote = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`;
ICONS.megaphone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`;
ICONS.newspaper = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>`;
ICONS.graduationCap = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`;
ICONS.scale = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`;
ICONS.globe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
ICONS.bookOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>`;
ICONS.plane = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
ICONS.feather = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/></svg>`;
ICONS.palette = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`;
ICONS.library = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>`;
ICONS.building2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
ICONS.draftingCompass = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="m12.99 6.74 1.93 3.44"/><path d="M19.136 12a10 10 0 0 1-14.271 0"/><path d="m21 21-2.16-3.84"/><path d="m3 21 8.02-14.26"/><circle cx="12" cy="5" r="2"/></svg>`;
ICONS.cog = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
ICONS.sprout = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>`;
ICONS.atom = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>`;
ICONS.messageHeart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.55 3.5 3.55-3.5a2.4 2.4 0 0 0 0-3.7"/></svg>`;
ICONS.shapes = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="3.5"/></svg>`;
ICONS.hourglass = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`;
ICONS.trophy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;

/* v2.7: أيقونات التخصصات والأسئلة */
ICONS.vase = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M9 3h6M10 3v3M14 3v3"/><path d="M10 6c-4 1-5 4-5 7 0 4 3 7 7 8 4-1 7-4 7-8 0-3-1-6-5-7"/><path d="M5.5 10H4a2 2 0 0 0 0 4h1.5M18.5 10H20a2 2 0 0 1 0 4h-1.5M6 14.5h12"/></svg>`;
ICONS.cross = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/></svg>`;
ICONS.bridge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M2 15h20"/><path d="M4 15c1-6 5-8 8-8s7 2 8 8"/><path d="M8 15v-5M12 15V7M16 15v-5"/><path d="M5 15v5M19 15v5"/></svg>`;
ICONS.monitor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>`;
ICONS.coffee = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8Z"/><path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M8 3v2M12 3v2"/></svg>`;
ICONS.flag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></svg>`;
ICONS.building = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/></svg>`;
ICONS.mapPin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>`;
ICONS.wallet = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2M6 6l9-3v3"/></svg>`;
ICONS.compass = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></svg>`;

/* v2.8: إعادة رسم أيقونات الأبعاد */
ICONS.brain = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.770 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.770 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.6 6.5a3 3 0 0 0 .4-1.375M6.003 5.125A3 3 0 0 0 6.4 6.5M3.477 10.896a4 4 0 0 1 .585-.396M19.938 10.5a4 4 0 0 1 .585.396M6 18a4 4 0 0 1-1.967-.516M19.967 17.484A4 4 0 0 1 18 18"/></svg>`;
ICONS.rocket = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M4.5 16.5c-1.5 1.260-2 5-2 5s3.740-.5 5-2c.710-.840.7-2.130-.090-2.910a2.180 2.180 0 0 0-2.910-.090Z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.950A12.880 12.880 0 0 1 22 2c0 2.720-.780 7.5-6 11a22.350 22.350 0 0 1-4 2Z"/><path d="M9 12H4s.550-3.030 2-4c1.620-1.080 5 0 5 0M12 15v5s3.030-.550 4-2c1.080-1.620 0-5 0-5"/></svg>`;
ICONS.heartHandshake = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true"><path d="M19 14c1.490-1.460 3-3.210 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.760 0-3 .5-4.5 2-1.5-1.5-2.740-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.050 3 5.5l7 7Z"/><path d="M12 5 9.040 7.960a2.170 2.170 0 0 0 0 3.080c.820.820 2.130.850 3 .070l2.070-1.9a2.820 2.820 0 0 1 3.790 0l2.960 2.660"/><path d="m18 15-2-2M15 18l-2-2"/></svg>`;

/* v2.9: استبدال الأيقونات المرسومة يدويًا والمتداخلة بأيقونات نظيفة بنفس الأسلوب */
const _svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{SIZE}" height="{SIZE}" class="{CLASS}" aria-hidden="true">${inner}</svg>`;
ICONS.sparkles = _svg(`<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>`);
ICONS.messagesSquare = _svg(`<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>`);
ICONS.cpu = _svg(`<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>`);
ICONS.clipboardList = _svg(`<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>`);
ICONS.clipboardCheck = _svg(`<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>`);
ICONS.usersRound = _svg(`<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>`);
ICONS.drama = _svg(`<path d="M3 5h10v7a5 5 0 0 1-10 0V5z"/><path d="M6 9h.01M10 9h.01"/><path d="M6 13c1 1 3 1 4 0"/><path d="M15 9h6v6a4 4 0 0 1-6 3.4"/><path d="M18 13h.01"/>`);
ICONS.wheat = _svg(`<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/><path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"/>`);
ICONS.flaskConical = _svg(`<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>`);
ICONS.landmark = _svg(`<path d="M3 22h18"/><path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7"/><path d="M12 2 20 7H4z"/>`);
ICONS.handHeart = _svg(`<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 6 6"/><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"/>`);
ICONS.scroll = _svg(`<path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>`);
ICONS.paintbrush = _svg(`<path d="m18 2 4 4-9 9-4-4 9-9Z"/><path d="M9 11c-3 0-5 2-5 5 0 2-1 3-2 4 3 1 8 0 8-4"/>`);

export default ICONS;
