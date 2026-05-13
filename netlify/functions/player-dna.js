// netlify/functions/player-dna.js
// Secure backend function - API key never exposed to frontend

const RATE_LIMIT = new Map(); // simple in-memory rate limiting

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // Simple rate limiting: max 10 requests per IP per 10 minutes
  const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 10;

  if (!RATE_LIMIT.has(ip)) {
    RATE_LIMIT.set(ip, { count: 0, resetAt: now + windowMs });
  }
  const limit = RATE_LIMIT.get(ip);
  if (now > limit.resetAt) { limit.count = 0; limit.resetAt = now + windowMs; }
  limit.count++;

  if (limit.count > maxRequests) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: "Zu viele Anfragen. Bitte warte kurz." }) };
  }

  try {
    const { sport, answers, questions } = JSON.parse(event.body || "{}");
    if (!sport || !answers || !questions) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Fehlende Daten" }) };
    }

    const sl = sport === "football" ? "Fußball" : "Tennis";
    const pairs = questions.map((q, i) => `${q}: ${answers[i]}`).join("\n");
    const overall_hint = answers.some(a =>
      typeof a === "string" && (a.includes("Profi") || a.includes("Elite") || a.includes("Top"))
    ) ? "high (80-92)" : "realistic (62-83)";

    const prompt = `Du bist die DNA-KI von SIGNUM Sports. Analysiere dieses ${sl}-Profil BRUTAL EHRLICH, witzig und TikTok-kompatibel.

Profil:
${pairs}

REGELN:
- Sei EHRLICH, DIREKT, manchmal bissig – kein generisches Motivations-Blabla
- Internet-Kultur erlaubt: "built for highlights", "too much aura", "Training Ballon d'Or", "cold mentality"
- Overall: ${overall_hint}
- Spieler-Pool groß! FB: Mbappe,Bellingham,Pedri,Vinicius,Haaland,Saka,Wirtz,Musiala,Gnabry,Gundogan,Xhaka,Ronaldinho,Zidane,Cantona,Robben,Ribery,Pirlo,Iniesta,Ballack
- Tennis: Alcaraz,Sinner,Rune,Fritz,Zverev,Medvedev,Kyrgios,Tiafoe,Djokovic,Nadal,Federer,Murray,Wawrinka
- Verdict Beispiele: "Technically gifted. Conditioning questionable." / "Too much aura for the bench." / "Built for highlights, not 90 minutes."
- Rarity: Bronze=60-69, Silver=70-79, Gold=80-89, Icon=90+
- Stats 40-95 passend zum Profil

NUR JSON:
{"player_type":"Epischer 2-3-Wort Typ","position":"Spezifische Position","overall":74,"pro_potential":61,"idol":"Spielername","idol_match":68,"idol_why":"Ehrlicher Satz max 8 Wörter","aura":"Aura mit Emoji","mentality":"Mentality-Begriff","top_skill":"Stärke 3-4 Wörter","weakness":"Schwäche 3-4 Wörter","verdict":"Ehrlicher Abschluss max 12 Wörter – KEIN Motivations-Blabla","rarity":"Gold","rarity_text":"Punchy Satz max 8 Wörter","rarity_percent":12,"stats":{"pac":72,"sho":65,"pas":70,"dri":75,"def":45,"phy":65},"tipps":[{"emoji":"🎯","titel":"Tipp","text":"Personalisierter Tipp max 15 Wörter","locked":false},{"emoji":"💪","titel":"Schwäche-Drill","teaser":"Was dieser Drill bewirkt max 8 Wörter","locked":true},{"emoji":"🧠","titel":"Mental-Unlock","teaser":"Was dieser Tipp bewirkt max 8 Wörter","locked":true}]}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic error:", err);
      return { statusCode: 502, headers, body: JSON.stringify({ error: "KI nicht erreichbar" }) };
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Ungültige KI-Antwort" }) };
    }

    const result = JSON.parse(match[0]);
    return { statusCode: 200, headers, body: JSON.stringify(result) };

  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server-Fehler: " + err.message }) };
  }
};
