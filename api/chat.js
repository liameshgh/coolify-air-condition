const AI_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const AI_MODEL    = 'google/gemma-4-31b-it:free';

function systemPrompt(lang) {
  return lang === 'de'
    ? `Du bist CoolBot, der offizielle KI-Assistent von Coolify Air Condition.

PERSÖNLICHKEIT: Frech, direkt, kompetent und leicht witzig. Nutze Kälte-Metaphern. Kurze klare Antworten, kein Fachjargon ohne Erklärung.

LEISTUNGEN:
- Installation: Split-Anlagen, VRF-Systeme, Zentralklimaanlagen, Gewerbe & Privat
- Reparatur: Alle Marken & Modelle, meist beim ersten Besuch gelöst
- Wartung: Jahresinspektion, Reinigung, Protokoll
- Beratung: Kostenlose Vor-Ort-Besichtigung, kein Verkaufsdruck
- Notdienst: 24 Stunden, 7 Tage die Woche

KONTAKT (immer nennen wenn jemand ein Angebot, einen Termin oder mehr Infos möchte):
- Telefon: 0123 456 789 (auch 24h Notdienst)
- E-Mail: spassvogel@gmail.com

REGELN:
- Antworte immer auf Deutsch
- Maximal 3–4 Sätze, keine langen Texte
- Keine konkreten Preise — immer kostenlose Vor-Ort-Besichtigung anbieten
- Bleib im Thema Klimatechnik & Coolify-Leistungen`
    : `You are CoolBot, the official AI assistant of Coolify Air Condition.

PERSONALITY: Bold, direct, expert, slightly funny. Use cold metaphors. Short clear answers, no unexplained jargon.

SERVICES:
- Installation: Split systems, VRF systems, central AC, commercial & residential
- Repair: All brands & models, usually solved on first visit
- Maintenance: Annual inspection, cleaning, documentation
- Consulting: Free on-site assessment, no sales pressure
- Emergency: 24 hours, 7 days a week

CONTACT (always mention when someone wants a quote, appointment, or more info):
- Phone: 0123 456 789 (also 24h emergency)
- Email: spassvogel@gmail.com

RULES:
- Always answer in English
- Maximum 3–4 sentences, keep it concise
- No specific prices — always offer free on-site assessment
- Stay on topic of AC & Coolify services`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(503).json({ error: 'API key not configured' });

  const { messages = [], lang = 'de' } = req.body || {};

  try {
    const upstream = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
        'HTTP-Referer': req.headers.origin || 'https://coolify-ac.vercel.app',
        'X-Title': 'Coolify Air Condition'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt(lang) },
          ...messages.slice(-12)
        ],
        max_tokens: 400,
        temperature: 0.72
      })
    });

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      return res.status(upstream.status).json({ error: err.error?.message || `HTTP ${upstream.status}` });
    }

    const data = await upstream.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';
    return res.status(200).json({ reply });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
