/**
 * Cloudflare Worker — بروكسي مساري AI
 * المتصفح → Worker → Groq، وإن فشل → Gemini (الفشل والتبديل يتمان على الخادم)
 *
 * المفاتيح تُحفظ كـ Secrets في Cloudflare فقط (لا تظهر في الكود ولا في GitHub):
 *   Workers & Pages → مساري → Settings → Variables and Secrets → Add (النوع: Secret)
 *     GROQ_API_KEY   = مفتاح Groq
 *     GEMINI_API_KEY = مفتاح Google AI Studio
 *   اختياري (نوع Text): GROQ_MODEL, GEMINI_MODEL
 */

// الموقع الوحيد المسموح له باستدعاء الـ Worker (أضف نطاقك المخصص لاحقاً إن وُجد)
const ALLOWED_ORIGINS = [
  'https://mxbr36-wq.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8000'
];

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const UPSTREAM_TIMEOUT_MS = 8000;
const MAX_MESSAGES = 12;
const MAX_CHARS = 4000;
const ROLES = ['system', 'user', 'assistant'];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };
    const reply = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!allowed) return reply({ error: 'forbidden origin' }, 403);
    if (request.method !== 'POST') return reply({ error: 'POST only' }, 405);

    let body;
    try { body = await request.json(); } catch { return reply({ error: 'invalid json' }, 400); }

    // تنظيف المدخلات: لا نثق بما يرسله المتصفح (النموذج والحدود يحددها الخادم)
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter(m => m && ROLES.includes(m.role) && typeof m.content === 'string')
      .slice(-MAX_MESSAGES)
      .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    if (!messages.length) return reply({ error: 'no messages' }, 400);

    const payload = { messages, temperature: 0.3, max_tokens: 450 };
    const providers = [
      env.GROQ_API_KEY && { name: 'groq', url: GROQ_URL, key: env.GROQ_API_KEY, model: env.GROQ_MODEL || 'qwen/qwen3.8-27b' },
      env.GEMINI_API_KEY && { name: 'gemini', url: GEMINI_URL, key: env.GEMINI_API_KEY, model: env.GEMINI_MODEL || 'gemini-flash-latest' }
    ].filter(Boolean);
    if (!providers.length) return reply({ error: 'no API keys configured' }, 500);

    for (const p of providers) {
      try {
        const res = await fetch(p.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${p.key}` },
          body: JSON.stringify({ ...payload, model: p.model }),
          signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
        });
        if (!res.ok) continue;                       // خطأ/حد استخدام → المزوّد التالي
        const data = await res.json();
        let text = String(data?.choices?.[0]?.message?.content || '');
        text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        if (text) return reply({ choices: [{ message: { role: 'assistant', content: text } }], provider: p.name });
      } catch (_) { /* مهلة أو شبكة → التالي */ }
    }
    return reply({ error: 'all providers failed' }, 502);
  }
};
