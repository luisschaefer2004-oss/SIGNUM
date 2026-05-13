import React, { useState, useEffect, useRef, useCallback } from "react";


// ─── FARBEN & KONSTANTEN ─────────────────────────────────────────────────────
const C = { fb: "#00ff87", tn: "#60efff" };
const sportColor = (s) => s === "football" ? C.fb : C.tn;

// ─── FRAGEN-POOL ─────────────────────────────────────────────────────────────
const POOL = {
  football: [
    // PFLICHT (immer dabei)
    { key:"alter",  type:"slider", icon:"🎂", q:"Wie alt bist du?", sub:"Fließt in deine DNA ein.", min:12, max:45, unit:" Jahre", label:["Junges Talent 🌱","Aufsteiger 🚀","Goldenes Alter 💪","Erfahren & klug 🧠"], required:true },
    { key:"verein", type:"input",  icon:"🏟️", q:"In welchem Verein spielst du?", sub:"Kein Verein? Schreib 'Kicker' 😄", placeholder:"z.B. Borussia Dortmund", required:true },
    { key:"pos",    type:"tap",    icon:"📍", q:"Welche Position gibst du dir ehrlich selbst?", sub:"Sei ehrlich. Wirklich.", answers:["Stürmer – ich will das Tor 🎯","Mittelfeld-Regisseur 🧠","Außenbahn-Rakete 🚀","Abwehr-Boss 🛡️","Bankwärmer mit Potenzial 😅"], required:true },
    { key:"technik",type:"slider", icon:"⚙️", q:"Wie gut ist deine Technik – ehrlich?", min:1, max:10, unit:"/10", label:["Noch am Lernen 😅","Solide für die Liga","Richtig gut 💪","Profi-Level 🌟"], required:true },
    { key:"mental", type:"slider", icon:"🧠", q:"Wie mental stark bist du in Drucksituationen?", min:1, max:10, unit:"/10", label:["Werde nervös 😬","Okay","Stark 💪","Ice Cold 🧊"], required:true },
    { key:"traum",  type:"tap",    icon:"⭐", q:"Was wäre dein absoluter Traum?", answers:["Champions League Finale ⭐","Auslands-Uni mit Stipendium 🎓","Football Creator mit Millionen 📱","Eigene Brand aufbauen 👑","Einfach Spaß bis ins Alter 😄"], required:true },
    { key:"moment", type:"tap",    icon:"🏆", q:"1:1, letzte Minute, du bekommst den Ball. Wer bist du?", sub:"Der Moment der Wahrheit.", answers:["Der Retter – ich will das 🦸","Eiskalt – als wäre es Training 🧊","Emotional explosiv 🌋","Froh wenn jemand anderes schießt 😅"], required:true },
    // ROTIEREND (zufällig gewählt)
    { key:"fuss",   type:"tap",    icon:"🦶", q:"Linker oder rechter Fuß?", answers:["Links – und ich bin stolz drauf ⚡","Rechts – der Klassiker 🦶","Beide gleich gut 🤝","Ich hab ehrlich einen schlechten Fuß 😅"] },
    { key:"sprint", type:"tap",    icon:"🚀", q:"Wie ist dein Sprint über 30m?", answers:["Schnellster im Team 🚀","Überdurchschnittlich","Durchschnitt – reicht","Ich hasse Sprints 🐢"] },
    { key:"prov",   type:"tap",    icon:"😤", q:"Ein Gegner provoziert dich. Du...", sub:"Echte Antwort.", answers:["Ignoriere es komplett 😎","Spiel's einfach raus 🔥","Sage was dazu 😤","Werde emotional 💀","Grinse zurück 😈"] },
    { key:"90min",  type:"tap",    icon:"⏱️", q:"90. Minute, 0:0. Was geht dir durch den Kopf?", answers:["'Ich mach das Tor jetzt' ⚡","'Bloß kein Fehler' 😬","'Wann pfeift der ab?' 💀","Totaler Flow 🧠"] },
    { key:"nied",   type:"tap",    icon:"💔", q:"Du verlierst 0:5. Was passiert danach?", answers:["Sofort Analyse & Training 📊","Kurz wütend, dann weiter 😤","Rede mit den Jungs 🗣️","Brauche 2 Tage 😔"] },
    { key:"schlaf", type:"tap",    icon:"😴", q:"Schlaf pro Nacht?", answers:["Unter 5h 💀","6 Stunden","7–8h 😴","Über 9h 🛌"] },
    { key:"alkoh",  type:"tap",    icon:"🥂", q:"Alkohol & Party?", answers:["Nie – ich bin Athlet 🚫","Selten","Nur Wochenende 🥂","Öfter als ich zugebe 😅"] },
    { key:"essen",  type:"tap",    icon:"🍝", q:"Was isst du vor einem Match?", answers:["Pasta – klassisch 🍝","Banane & Riegel 🍌","Was gerade da ist 😅","Ich esse kaum vorher"] },
    { key:"musik",  type:"tap",    icon:"🎧", q:"Was hörst du vor dem Spiel?", answers:["Nichts – volle Konzentration 🧘","Aggressiver Rap 🔥","Chill-Playlist 😌","Ich rede mit den Jungs 😄"] },
    { key:"team",   type:"tap",    icon:"👥", q:"Wie bist du als Mitspieler?", answers:["Ich führe und rede viel 👑","Ich führe durch Leistung 💪","Der Motivator 🔥","Ruhig aber verlässlich 😶"] },
    { key:"kritik", type:"tap",    icon:"🪞", q:"Dein ehrlichster Selbst-Kritikpunkt?", sub:"Innerlich weißt du es.", answers:["Zu langsam 🐢","Verliere zu schnell den Kopf 🌋","Nicht konstant genug 📉","Technisch limitiert 🔧"] },
    { key:"freis",  type:"tap",    icon:"🎯", q:"Freistoß, 20m. Wer schießt?", answers:["Ich. Natürlich. 😤","Der Technisch-Beste","Es gibt eine Diskussion 🗣️","Ich weiche aus 👀"] },
    { key:"fitness",type:"slider", icon:"💪", q:"Wie fit bist du gerade – wirklich?", min:1, max:10, unit:"/10", label:["Couch-Athlet 😅","Okay für Hobby","Gut trainiert 💪","Athleten-Level 🏆"] },
    { key:"einsatz",type:"slider", icon:"🔥", q:"Wie viel Prozent gibst du im Training?", min:50, max:100, unit:"%", label:["Chillig 😌","Solide","Committed 💪","Alles oder nichts 🔥"] },
    { key:"tv",     type:"tap",    icon:"📺", q:"Wie oft schaust du Fußball pro Woche?", answers:["Täglich 📺","2–3x","Nur Champions League","Ich spiele lieber 😄"] },
  ],
  tennis: [
    // PFLICHT
    { key:"alter",  type:"slider", icon:"🎂", q:"Wie alt bist du?", sub:"Fließt in deine DNA ein.", min:10, max:60, unit:" Jahre", label:["Junges Talent 🌱","Aufsteiger 🚀","Goldenes Alter 💪","Erfahren & klug 🧠"], required:true },
    { key:"lk",     type:"tap",    icon:"🏆", q:"Deine Leistungsklasse (LK)?", sub:"LK 1 = top, LK 23 = Einsteiger", answers:["LK 1–5 (Spitze) 🏆","LK 6–10 (Stark) 💪","LK 11–15 (Mittelfeld) 🎯","LK 16–23 (Aufsteiger) 🌱","Keine LK / Hobby 😄"], required:true },
    { key:"typ",    type:"tap",    icon:"📍", q:"Welcher Spielertyp bist du ehrlich?", sub:"Kein Ego.", answers:["Offensiver Baseliner 💥","Defender 🛡️","Serve & Volley ⚡","Allrounder 🎯","Noch am Herausfinden 🤷"], required:true },
    { key:"aufschl",type:"slider", icon:"⚙️", q:"Wie gut ist dein Aufschlag wirklich?", sub:"1 = Double Fault Maschine, 10 = Ace Machine", min:1, max:10, unit:"/10", label:["Double Fault Maschine 😅","Solide","Richtig stark 💪","Absolute Waffe 🚀"], required:true },
    { key:"mental", type:"slider", icon:"🧊", q:"Wie mental stark bist du im Tiebreak?", min:1, max:10, unit:"/10", label:["Nervös 😬","Okay","Stark 💪","Ice Cold 🧊"], required:true },
    { key:"traum",  type:"tap",    icon:"⭐", q:"Dein absoluter Traum im Tennis?", answers:["Grand Slam spielen 🏆","ATP/WTA Tour 🌍","Tennis Creator 📱","Coaching-Empire 👑","Einfach Spaß 😄"], required:true },
    { key:"tb",     type:"tap",    icon:"🏆", q:"Tiebreak, 6:6. Wer bist du?", sub:"Der Moment der Wahrheit.", answers:["Eiskalt – ich will das 🧊","Aggro – alles rein 🔥","Stratege 🧠","Ehrlich nervöser als sonst 😬"], required:true },
    // ROTIEREND
    { key:"seite",  type:"tap",    icon:"💥", q:"Vorhand oder Rückhand – welche liebst du?", answers:["Vorhand – meine Waffe 🔥","Rückhand – unterschätzt 💪","Beide gleich","Vorhand... wenn sie läuft 😅"] },
    { key:"df",     type:"tap",    icon:"😬", q:"Doppelfehler im wichtigsten Moment. Du...", sub:"Sei ehrlich.", answers:["Lache über mich selbst 😅","Innerlich wütend, außen cool 😤","Schüttle den Kopf und reset 😶","Denke noch 5 Punkte daran 💀","Verliere sofort den Faden 🫠"] },
    { key:"fuehru", type:"tap",    icon:"🎭", q:"Du führst 5:2 im dritten Satz. Wie spielst du?", answers:["Gleich aggressiv 🔥","Etwas vorsichtiger 😬","Full-Fokus 🧠","Werde nervöser als beim 2:5 💀"] },
    { key:"geduld", type:"tap",    icon:"🕐", q:"Dein Gegner macht keine Fehler. Du?", answers:["Variiere sofort meinen Stil 🧠","Warte geduldig 🕐","Erhöhe Risiko 🔥","Werde frustriert 😤"] },
    { key:"schlaf", type:"tap",    icon:"😴", q:"Schlaf vor einem Match?", answers:["Wie ein Baby 😴","Etwas unruhig","Kaum – ich denke durch Szenarien 💀","Egal, schlafe immer gut 😎"] },
    { key:"alkoh",  type:"tap",    icon:"🥂", q:"Alkohol & Party?", answers:["Nie – ich bin Athlet 🚫","Selten","Nur Wochenende 🥂","Öfter als ich zugebe 😅"] },
    { key:"feiern", type:"tap",    icon:"🎉", q:"Nach einem gewonnenen Punkt – du?", answers:["Neutral – sofort weiter","Kurze Faust 💪","Laut feiern 🎉","Schaue zu Coach 👀"] },
    { key:"verh",   type:"tap",    icon:"🎭", q:"Auffälligstes Verhalten auf dem Platz?", answers:["Rede/fluche mit mir selbst 😤","Bin Eisblock 🧊","Feiere jeden Punkt 🎉","Sehr wechselhaft 🎢"] },
    { key:"musik",  type:"tap",    icon:"🎧", q:"Musik beim Warm-Up?", answers:["Nichts – Fokus 🧘","Aggressiver Rap 🔥","Chill-Playlist 😌","Matches anschauen 🎾"] },
    { key:"kritik", type:"tap",    icon:"🪞", q:"Dein ehrlichster Selbst-Kritikpunkt?", sub:"Innerlich weißt du es.", answers:["Konditionell limitiert 🐢","Technik hat Lücken 🔧","Verliere mental den Faden 🌋","Trainiere zu wenig 😅"] },
    { key:"fitness",type:"slider", icon:"💪", q:"Körperliche Fitness – ehrlich?", min:1, max:10, unit:"/10", label:["Couch-Athlet 😅","Okay","Gut trainiert 💪","Athleten-Level 🏆"] },
    { key:"einsatz",type:"slider", icon:"🔥", q:"Wie viel Prozent gibst du im Training?", min:50, max:100, unit:"%", label:["Chillig 😌","Solide","Committed 💪","Alles oder nichts 🔥"] },
    { key:"ed",     type:"tap",    icon:"🎾", q:"Einzel oder Doppel?", answers:["Einzel – ich entscheide alles selbst","Doppel – Teamwork 💪","Beides gleich","Doppel wenn ich schlechte Form habe 😅"] },
  ]
};

const REQUIRED_COUNT = 7;
const TOTAL = 12;

function buildQuestions(sport) {
  const pool = POOL[sport];
  const req = pool.filter(q => q.required);
  const opt = pool.filter(q => !q.required).sort(() => Math.random() - 0.5);
  const extra = opt.slice(0, TOTAL - req.length);
  const all = [...req, ...extra];
  const order = pool.map(q => q.key);
  return all.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
}

// ─── API ──────────────────────────────────────────────────────────────────────
async function fetchDNA(sport, answers, questions) {
  const sl = sport === "football" ? "Fußball" : "Tennis";
  const pairs = questions.map((q, i) => `${q.q}: ${answers[i]}`).join("\n");
  const statKeys = sport === "football"
    ? ["pac","sho","pas","dri","def","phy"]
    : ["srv","ret","tec","mnt","spd","sta"];

  const prompt = `SIGNUM DNA Analyse. Sport: ${sl}.
Profil:
${pairs}

Regeln:
- Sei kreativ, überraschend, ehrlich und humorvoll
- NICHT immer Messi/Ronaldo/Federer – nutze die volle Spieler-Palette!
- Fußball-Auswahl: Mbappe, Bellingham, Pedri, Vinicius, Haaland, Saka, Valverde, Odegaard, Salah, Wirtz, Musiala, Gnabry, Gundogan, Kimmich, Xhaka, Goretzka, Nkunku, Coman, Ronaldinho, Zidane, Cantona, Robben, Ribery, Lampard, Gerrard, Scholes, Pirlo, Iniesta, Ballack
- Tennis-Auswahl: Alcaraz, Sinner, Rune, Fritz, Zverev, Medvedev, Tsitsipas, Rublev, Ruud, Kyrgios, Tiafoe, Shapovalov, Auger-Aliassime, Djokovic, Nadal, Federer, Murray, Wawrinka, Thiem
- Funny options möglich: "Bankwärmer mit Aura", "Training Ground Legend", "Sunday League Hero"
- Stats (${statKeys.join(",")}) zwischen 40-95, passend zum Profil

NUR JSON:
{
  "player_type": "Epischer 2-3-Wort Spielertyp",
  "position": "Spezifische Position oder Rolle",
  "overall": 74,
  "pro_potential": 61,
  "idol": "Spielername",
  "idol_match": 68,
  "idol_why": "Witziger/ehrlicher Satz max 8 Wörter",
  "aura": "Aura mit Emoji",
  "mentality": "Mentality-Begriff",
  "top_skill": "Stärke in 4 Wörtern",
  "weakness": "Schwäche in 4 Wörtern",
  "verdict": "Epischer oder humorvoller Abschluss max 12 Wörter",
  "stats": {${statKeys.map(k => `"${k}": 70`).join(", ")}},
  "tipps": [
    {"emoji": "🎯", "titel": "Konkreter Tipp-Titel", "text": "Personalisierter Tipp max 16 Wörter", "locked": false},
    {"emoji": "💪", "titel": "Schwäche-Drill Titel", "teaser": "Was dieser Drill bewirkt max 8 Wörter", "locked": true},
    {"emoji": "🧠", "titel": "Mental-Unlock Titel", "teaser": "Was dieser Tipp bewirkt max 8 Wörter", "locked": true}
  ]
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`API Fehler ${res.status}${txt ? ": " + txt.slice(0, 80) : ""}`);
  }

  const data = await res.json();
  const raw = data.content?.[0]?.text || "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Keine Auswertung erhalten");
  return JSON.parse(match[0]);
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
async function saveScore(sport, playerType, overall, idol) {
  try {
    const entry = JSON.stringify({ sport, playerType, overall, idol, ts: Date.now() });
    const key = `score_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    await window.storage.set(key, entry, true);
  } catch (e) { /* silent fail */ }
}

async function loadLeaderboard() {
  try {
    const result = await window.storage.list("score_", true);
    const keys = result?.keys || [];
    const entries = await Promise.all(
      keys.slice(-20).map(k => window.storage.get(k, true).then(r => r ? JSON.parse(r.value) : null).catch(() => null))
    );
    return entries.filter(Boolean).sort((a, b) => b.overall - a.overall).slice(0, 10);
  } catch { return []; }
}

// ─── COUNTER ─────────────────────────────────────────────────────────────────
function CountUp({ to, dur = 1800 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start = null;
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{v}</>;
}

// ─── INPUT FRAGE ──────────────────────────────────────────────────────────────
function InputQ({ q, onAnswer, color }) {
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);
  const submit = (v) => { if (done) return; setDone(true); setTimeout(() => onAnswer(v || "Kein Verein"), 350); };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <input
        autoFocus type="text" placeholder={q.placeholder} value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit(val.trim())}
        style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${val ? color + "80" : "rgba(255,255,255,0.15)"}`, borderRadius: 16, padding: "20px 22px", color: "#fff", fontSize: 18, fontWeight: 500, outline: "none", width: "100%", marginBottom: 14, fontFamily: "inherit", transition: "border-color 0.2s" }}
      />
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => submit(val.trim())} style={{ flex: 1, background: val.trim() ? color : "rgba(255,255,255,0.08)", color: val.trim() ? "#000" : "rgba(255,255,255,0.3)", border: "none", borderRadius: 14, padding: "16px", fontSize: 15, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }}>
          {done ? "✓" : "Weiter →"}
        </button>
        <button onClick={() => submit("")} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", borderRadius: 14, padding: "14px 18px", fontSize: 13, cursor: "pointer" }}>
          Überspringen
        </button>
      </div>
    </div>
  );
}

// ─── SLIDER FRAGE ─────────────────────────────────────────────────────────────
function SliderQ({ q, onAnswer, color }) {
  const [val, setVal] = useState(Math.round((q.min + q.max) / 2));
  const [done, setDone] = useState(false);
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const pct = ((val - q.min) / (q.max - q.min)) * 100;
  const li = pct < 25 ? 0 : pct < 50 ? 1 : pct < 75 ? 2 : 3;

  const upd = useCallback((cx) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    setVal(Math.round(q.min + p * (q.max - q.min)));
  }, [q]);

  const submit = () => { if (!done) { setDone(true); setTimeout(() => onAnswer(`${val}${q.unit}`), 350); } };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 68, fontWeight: 900, color, lineHeight: 1, filter: `drop-shadow(0 0 20px ${color}50)`, marginBottom: 8 }}>
          {val}<span style={{ fontSize: 26 }}>{q.unit}</span>
        </div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>{q.label[li]}</div>
      </div>
      <div style={{ padding: "0 4px", marginBottom: 40 }}>
        <div ref={ref}
          style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 100, position: "relative", cursor: "pointer", userSelect: "none" }}
          onMouseDown={e => { setDrag(true); upd(e.clientX); }}
          onMouseMove={e => { if (drag) upd(e.clientX); }}
          onMouseUp={() => setDrag(false)}
          onMouseLeave={() => setDrag(false)}
          onTouchStart={e => upd(e.touches[0].clientX)}
          onTouchMove={e => { e.preventDefault(); upd(e.touches[0].clientX); }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: 100 }} />
          <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 32, height: 32, borderRadius: "50%", background: color, border: "4px solid #000", boxShadow: `0 0 20px ${color}70` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{q.min}{q.unit}</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{q.max}{q.unit}</span>
        </div>
      </div>
      <button onClick={submit} style={{ background: done ? `${color}30` : color, color: done ? color : "#000", border: "none", borderRadius: 16, padding: "18px", fontSize: 16, fontWeight: 800, cursor: "pointer", transition: "all 0.25s", width: "100%", boxShadow: done ? "none" : `0 8px 24px ${color}30` }}>
        {done ? "✓" : `Weiter mit ${val}${q.unit} →`}
      </button>
    </div>
  );
}

// ─── TAP FRAGE ────────────────────────────────────────────────────────────────
function TapQ({ q, onAnswer, color }) {
  const [sel, setSel] = useState(null);
  const tap = a => {
    if (sel) return;
    setSel(a);
    setTimeout(() => onAnswer(a), 480);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {q.answers.map((a, i) => (
        <button key={i} onClick={() => tap(a)}
          style={{
            background: sel === a ? color : sel ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${sel === a ? color : sel ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)"}`,
            borderRadius: 14, padding: "16px 20px",
            color: sel === a ? "#000" : sel ? "rgba(255,255,255,0.25)" : "#fff",
            fontSize: 15, fontWeight: sel === a ? 800 : 500,
            textAlign: "left", cursor: sel ? "default" : "pointer",
            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
            transform: sel === a ? "scale(1.015)" : "scale(1)",
            boxShadow: sel === a ? `0 4px 20px ${color}30` : "none",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
          onMouseEnter={e => { if (!sel) { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; } }}
          onMouseLeave={e => { if (!sel) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; } }}
        >
          <span>{a}</span>
          {sel === a && <span style={{ fontWeight: 900 }}>✓</span>}
        </button>
      ))}
    </div>
  );
}

// ─── FIFA KARTE ───────────────────────────────────────────────────────────────
function PlayerCard({ r, sport, size = 1 }) {
  const overall = r.overall || 75;
  const color = sportColor(sport);
  const cardGrad = overall >= 88
    ? ["#FFD700", "#FFA500"]
    : overall >= 80
    ? ["#C0C0C0", "#A8A8A8"]
    : overall >= 70
    ? ["#CD7F32", "#A0522D"]
    : ["#666", "#444"];

  const stats = sport === "football"
    ? [["PAC", r.stats?.pac || 70], ["SHO", r.stats?.sho || 65], ["PAS", r.stats?.pas || 68], ["DRI", r.stats?.dri || 72], ["DEF", r.stats?.def || 45], ["PHY", r.stats?.phy || 65]]
    : [["SRV", r.stats?.srv || 70], ["RET", r.stats?.ret || 65], ["TEC", r.stats?.tec || 68], ["MNT", r.stats?.mnt || 75], ["SPD", r.stats?.spd || 65], ["STA", r.stats?.sta || 68]];

  const W = Math.round(280 * size), H = Math.round(400 * size), s = size;

  return (
    <div style={{ width: W, height: H, borderRadius: 16 * s, background: `linear-gradient(145deg, ${cardGrad[0]}18, ${cardGrad[1]}08, #080808)`, border: `1.5px solid ${cardGrad[0]}50`, position: "relative", overflow: "hidden", boxShadow: `0 0 50px ${cardGrad[0]}20, 0 20px 60px rgba(0,0,0,0.7)`, flexShrink: 0 }}>
      {/* Glow */}
      <div style={{ position: "absolute", top: -30 * s, right: -30 * s, width: 160 * s, height: 160 * s, background: `radial-gradient(circle, ${cardGrad[0]}12, transparent 70%)`, pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ padding: `${16 * s}px ${16 * s}px ${8 * s}px`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 54 * s, fontWeight: 900, lineHeight: 1, color: cardGrad[0], filter: `drop-shadow(0 0 12px ${cardGrad[0]}60)` }}>{overall}</div>
          <div style={{ fontSize: 9 * s, fontWeight: 700, letterSpacing: "0.12em", color: cardGrad[0], opacity: 0.8, marginTop: 2 * s }}>{r.position || "PLAYER"}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26 * s }}>{sport === "football" ? "⚽" : "🎾"}</div>
          <div style={{ fontSize: 9 * s, color: "rgba(255,255,255,0.35)", marginTop: 3 * s, letterSpacing: "0.1em" }}>SIGNUM</div>
        </div>
      </div>

      {/* Name & Aura */}
      <div style={{ padding: `${6 * s}px ${16 * s}px ${8 * s}px`, borderTop: `1px solid ${cardGrad[0]}20`, borderBottom: `1px solid ${cardGrad[0]}20` }}>
        <div style={{ fontSize: 16 * s, fontWeight: 900, color: "#fff", marginBottom: 2 * s }}>{r.player_type}</div>
        <div style={{ fontSize: 10 * s, color: color, fontStyle: "italic" }}>{r.aura} · {r.mentality}</div>
      </div>

      {/* Stats */}
      <div style={{ padding: `${10 * s}px ${16 * s}px`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: `${8 * s}px ${14 * s}px` }}>
        {stats.map(([label, val]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 * s }}>
            <div style={{ fontSize: 15 * s, fontWeight: 900, color: cardGrad[0], minWidth: 24 * s }}>{val}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 7 * s, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", marginBottom: 2 * s }}>{label}</div>
              <div style={{ height: 2 * s, background: "rgba(255,255,255,0.08)", borderRadius: 100 }}>
                <div style={{ height: "100%", width: `${val}%`, background: `linear-gradient(90deg, ${cardGrad[0]}60, ${cardGrad[0]})`, borderRadius: 100 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Idol */}
      <div style={{ margin: `${4 * s}px ${16 * s}px`, background: "rgba(255,255,255,0.04)", borderRadius: 9 * s, padding: `${8 * s}px ${12 * s}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 8 * s, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>ÄHNLICH WIE</div>
          <div style={{ fontSize: 13 * s, fontWeight: 800, color: "#fff" }}>{r.idol}</div>
        </div>
        <div style={{ fontSize: 18 * s, fontWeight: 900, color: cardGrad[0] }}>{r.idol_match}%</div>
      </div>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 8 * s, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 8 * s, letterSpacing: "0.25em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>SIGNUM · signum-sports.de</div>
      </div>
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────────────────────
function Loading({ sport }) {
  const color = sportColor(sport);
  const [step, setStep] = useState(0);
  const steps = ["DNA scannen...", "Spielerprofil analysieren...", "Spieler-Match suchen...", "Stats berechnen...", "Karte generieren..."];
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
      <div style={{ position: "relative", width: 110, height: 110, marginBottom: 48 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${color}20` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid transparent`, borderTopColor: color, animation: "spin 1s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
          {sport === "football" ? "⚽" : "🎾"}
        </div>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 14, color, letterSpacing: "0.08em", marginBottom: 32, minHeight: 22 }}>{steps[step]}</div>
      <div style={{ width: 200, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" }}>
        <div style={{ height: "100%", background: color, borderRadius: 100, animation: "loadFill 4s ease-in-out forwards", boxShadow: `0 0 8px ${color}` }} />
      </div>
    </div>
  );
}

// ─── ERGEBNIS ─────────────────────────────────────────────────────────────────
function Result({ r, sport, restart }) {
  const color = sportColor(sport);
  const [show, setShow] = useState(false);
  const [cardView, setCardView] = useState(false);
  const [copied, setCopied] = useState(false);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    setTimeout(() => setShow(true), 150);
    saveScore(sport, r.player_type, r.overall, r.idol);
    loadLeaderboard().then(setBoard);
  }, []);

  const shareText = `🧬 Mein SIGNUM Player DNA\n\n⚡ ${r.player_type}\n📊 Overall: ${r.overall}/100\n🎯 Ähnlich wie: ${r.idol} (${r.idol_match}%)\n✨ ${r.aura}\n\n"${r.verdict}"\n\nKannst du mich schlagen? 👀\nsignum-sports.de`;

  const shareWA = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");

  const shareGeneral = () => {
    if (navigator.share) {
      navigator.share({ title: "SIGNUM Player DNA", text: shareText, url: "https://signum-sports.de" }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const copyLink = () => {
    navigator.clipboard?.writeText("signum-sports.de");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (cardView) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20, textAlign: "center" }}>Deine SIGNUM Karte</div>
      <PlayerCard r={r} sport={sport} size={1} />
      <div style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 1.6 }}>
        📸 Screenshot machen & posten!<br />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>#SIGNUMPlayerDNA #signum</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300, marginTop: 24 }}>
        <button onClick={shareWA} style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          Per WhatsApp teilen 💬
        </button>
        <button onClick={() => setCardView(false)} style={{ background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "12px", fontSize: 13, cursor: "pointer" }}>
          ← Zurück
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "28px 20px 48px", overflowY: "auto" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24, opacity: show ? 1 : 0, transition: "opacity 0.5s" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>SIGNUM · DNA ANALYSE</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>Dein Ergebnis 🔥</div>
      </div>

      {/* Haupt-Card */}
      <div style={{ background: "linear-gradient(145deg, #121212, #161616, #0e0e0e)", border: `1px solid ${color}40`, borderRadius: 24, overflow: "hidden", marginBottom: 14, boxShadow: `0 0 60px ${color}10, 0 20px 60px rgba(0,0,0,0.5)`, opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s" }}>
        <div style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)`, padding: "10px 20px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.18em", color: "#000" }}>SIGNUM PLAYER DNA</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.6)" }}>{sport === "football" ? "⚽ FB" : "🎾 TN"}</span>
        </div>
        <div style={{ padding: "22px 20px" }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ textAlign: "center", minWidth: 80 }}>
              <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1, color, filter: `drop-shadow(0 0 16px ${color}50)` }}>
                <CountUp to={r.overall} dur={1800} />
              </div>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Overall</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.15, marginBottom: 6 }}>{r.player_type}</div>
              <div style={{ fontSize: 12, color, marginBottom: 6 }}>{r.position}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, background: "rgba(255,255,255,0.08)", borderRadius: 100, padding: "3px 10px", color: "rgba(255,255,255,0.6)" }}>{r.aura}</span>
                <span style={{ fontSize: 11, background: "rgba(255,255,255,0.08)", borderRadius: 100, padding: "3px 10px", color: "rgba(255,255,255,0.6)" }}>{r.mentality}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: `${color}12`, border: `1px solid ${color}35`, borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color, marginBottom: 4 }}>Pro-Potenzial</div>
              <div style={{ fontSize: 30, fontWeight: 900, color }}><CountUp to={r.pro_potential} dur={2000} />%</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>≈ {r.idol}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#fff" }}><CountUp to={r.idol_match} dur={2000} />%</div>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${color}20`, border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {sport === "football" ? "⚽" : "🎾"}
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>Spieler-Match</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{r.idol}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>{r.idol_why}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color, marginBottom: 4 }}>💪 Stärke</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{r.top_skill}</div>
            </div>
            <div style={{ background: "rgba(255,80,80,0.07)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#ff7070", marginBottom: 4 }}>⚠️ Schwäche</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{r.weakness}</div>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", fontStyle: "italic", lineHeight: 1.6 }}>"{r.verdict}"</div>
          </div>
        </div>
      </div>

      {/* FIFA Karte Preview */}
      <div onClick={() => setCardView(true)} style={{ background: `linear-gradient(135deg, ${color}12, rgba(255,255,255,0.02))`, border: `1px solid ${color}25`, borderRadius: 18, padding: "16px 18px", marginBottom: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, opacity: show ? 1 : 0, transition: "opacity 0.5s 0.25s" }}>
        <PlayerCard r={r} sport={sport} size={0.55} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>Deine Spielerkarte 🃏</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 10 }}>Screenshot & auf TikTok / Instagram!</div>
          <div style={{ background: color, color: "#000", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 800, display: "inline-block" }}>Karte ansehen →</div>
        </div>
      </div>

      {/* Tipps */}
      <div style={{ marginBottom: 14, opacity: show ? 1 : 0, transition: "opacity 0.5s 0.35s" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12, textAlign: "center" }}>Deine Tipps</div>
        {(r.tipps || []).map((t, i) => t.locked ? (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", marginBottom: 9, position: "relative", overflow: "hidden", minHeight: 80 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>🔒</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{t.titel}</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontStyle: "italic", textAlign: "center" }}>{t.teaser}</div>
              <button onClick={() => window.open("https://signum7.gumroad.com/l/ucqkbq", "_blank")} style={{ background: color, color: "#000", border: "none", borderRadius: 100, padding: "6px 16px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                Im Starter Pack freischalten →
              </button>
            </div>
            <div style={{ filter: "blur(5px)", display: "flex", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{t.emoji}</span>
              <div><div style={{ height: 16, background: "rgba(255,255,255,0.1)", borderRadius: 4, width: 100, marginBottom: 8 }} /><div style={{ height: 30, background: "rgba(255,255,255,0.06)", borderRadius: 4 }} /></div>
            </div>
          </div>
        ) : (
          <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${color}20`, borderRadius: 14, padding: "14px 16px", marginBottom: 9, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{t.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{t.titel}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{t.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Freunde herausfordern */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "22px 20px", marginBottom: 14, opacity: show ? 1 : 0, transition: "opacity 0.5s 0.5s" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>👀</div>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Fordere deine Freunde heraus!</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
            Wer bekommt den höheren Overall?<br />Dein Score: <span style={{ color, fontWeight: 800 }}>{r.overall}/100</span> – können sie dich schlagen?
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={shareWA} style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.287 7.04L.79 23.17l4.236-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.012-1.375l-.36-.213-3.715 1.295 1.236-3.619-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>
            Per WhatsApp senden
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={copyLink} style={{ background: "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 14, padding: "13px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {copied ? "✓ Kopiert!" : "🔗 Link kopieren"}
            </button>
            <button onClick={shareGeneral} style={{ background: "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 14, padding: "13px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              📤 Teilen
            </button>
          </div>
        </div>
      </div>

      {/* Rangliste */}
      {board.length > 0 && (
        <div style={{ marginBottom: 14, opacity: show ? 1 : 0, transition: "opacity 0.5s 0.6s" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12, textAlign: "center" }}>🏆 Community Rangliste</div>
          {board.slice(0, 5).map((entry, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: entry.overall === r.overall ? `${color}10` : "rgba(255,255,255,0.03)", border: `1px solid ${entry.overall === r.overall ? color + "30" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, marginBottom: 6 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "rgba(255,255,255,0.3)", minWidth: 20 }}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{entry.playerType}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{entry.sport === "football" ? "⚽" : "🎾"} · Ähnlich: {entry.idol}</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: sportColor(entry.sport) }}>{entry.overall}</div>
            </div>
          ))}
        </div>
      )}

      {/* Soft CTA */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12, opacity: show ? 1 : 0, transition: "opacity 0.5s 0.7s" }}>
        <span style={{ fontSize: 24 }}>📦</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Schwäche wirklich verbessern?</div>
          <button onClick={() => window.open("https://signum7.gumroad.com/l/ucqkbq", "_blank")} style={{ background: "none", color: "rgba(255,255,255,0.4)", border: "none", padding: 0, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
            SIGNUM Starter Pack · 19€ →
          </button>
        </div>
      </div>

      <button onClick={restart} style={{ background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px", fontSize: 14, cursor: "pointer", width: "100%", marginBottom: 20, opacity: show ? 1 : 0, transition: "opacity 0.5s 0.8s" }}>
        🔄 Nochmal testen
      </button>
      <div style={{ textAlign: "center", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>signum-sports.de</div>
    </div>
  );
}

// ─── HAUPT APP ────────────────────────────────────────────────────────────────
function PlayerDNAApp() {
  const [screen, setScreen] = useState("land");
  const [sport, setSport] = useState(null);
  const [qs, setQs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const color = sportColor(sport);
  const qi = answers.length;
  const pct = qs.length ? Math.round(((qi + 1) / (qs.length + 1)) * 100) : 0;

  const startSport = (s) => {
    setSport(s);
    setQs(buildQuestions(s));
    setScreen("q");
  };

  const answer = useCallback((a) => {
    const na = [...answers, a];
    setAnswers(na);
    if (na.length >= qs.length) {
      setScreen("load");
      fetchDNA(sport, na, qs)
        .then(r => { setResult(r); setScreen("result"); })
        .catch(e => { setErrMsg(e.message); setScreen("err"); });
    }
  }, [answers, sport, qs]);

  const restart = () => { setScreen("land"); setSport(null); setQs([]); setAnswers([]); setResult(null); setErrMsg(""); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { background: #000; color: #fff; font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        button { font-family: inherit; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes loadFill { from { width: 0; } to { width: 100%; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ background: "#000", minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>

        {/* LANDING */}
        {screen === "land" && (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center", animation: "fadeUp 0.6s ease" }}>
            <div style={{ position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)", width: 320, height: 320, background: "radial-gradient(circle, rgba(0,255,135,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ fontSize: 10, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>SIGNUM Sports · KI</div>
            <h1 style={{ fontSize: "clamp(64px, 16vw, 100px)", fontWeight: 900, lineHeight: 0.88, marginBottom: 20, background: "linear-gradient(160deg, #fff 20%, #444 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em" }}>
              PLAYER<br />DNA
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.38)", marginBottom: 44, lineHeight: 1.75, maxWidth: 260 }}>
              Finde heraus welcher Spielertyp du wirklich bist.<br />Vergleiche dich mit deinen Freunden. 👀
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 44 }}>
              {["⚽ Fußball", "🎾 Tennis", "🧠 KI-Auswertung", "🃏 Spielerkarte", "👀 Freunde herausfordern"].map(t => (
                <span key={t} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "7px 16px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{t}</span>
              ))}
            </div>
            <button onClick={() => setScreen("sport")}
              style={{ background: "#fff", color: "#000", border: "none", borderRadius: 20, padding: "19px 56px", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 0 50px rgba(255,255,255,0.1)", transition: "transform 0.2s", letterSpacing: "-0.01em" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Test starten →
            </button>
            <p style={{ marginTop: 18, fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>KOSTENLOS · KEINE ANMELDUNG · IMMER NEUE FRAGEN</p>
          </div>
        )}

        {/* SPORT WAHL */}
        {screen === "sport" && (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", animation: "fadeUp 0.5s ease" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Sport wählen</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10, textAlign: "center" }}>Für welchen Sport?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 48, textAlign: "center" }}>Jede Sport-DNA ist einzigartig.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 340 }}>
              {[{ id: "football", l: "Fußball", e: "⚽", c: C.fb }, { id: "tennis", l: "Tennis", e: "🎾", c: C.tn }].map(s => (
                <button key={s.id} onClick={() => startSport(s.id)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "26px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: "#fff", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = s.c; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 36 }}>{s.e}</span>
                    <span style={{ fontSize: 22, fontWeight: 700 }}>{s.l}</span>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FRAGEN */}
        {screen === "q" && sport && qi < qs.length && (() => {
          const q = qs[qi];
          return (
            <div key={qi} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: "28px 22px 40px", animation: "fadeUp 0.38s ease" }}>
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{qi + 1} / {qs.length}</span>
                  <span style={{ fontSize: 11, color }}>{pct}%</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 100, transition: "width 0.5s ease", boxShadow: `0 0 8px ${color}70` }} />
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{q.icon}</div>
                <h2 style={{ fontSize: "clamp(20px, 5.5vw, 28px)", fontWeight: 800, lineHeight: 1.25, color: "#fff", marginBottom: q.sub ? 8 : 0 }}>{q.q}</h2>
                {q.sub && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{q.sub}</div>}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {q.type === "tap" ? <TapQ key={qi} q={q} onAnswer={answer} color={color} />
                  : q.type === "input" ? <InputQ key={qi} q={q} onAnswer={answer} color={color} />
                  : <SliderQ key={qi} q={q} onAnswer={answer} color={color} />}
              </div>
            </div>
          );
        })()}

        {screen === "load" && <Loading sport={sport} />}
        {screen === "result" && result && <Result r={result} sport={sport} restart={restart} />}

        {screen === "err" && (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 8, fontSize: 15 }}>KI-Verbindung fehlgeschlagen.</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginBottom: 32, fontFamily: "monospace" }}>{errMsg}</p>
            <button onClick={restart} style={{ background: "#fff", color: "#000", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Nochmal versuchen
            </button>
          </div>
        )}
      </div>
    </>
  );
}


// ─── ICONS ───────────────────────────────────────────
const SIGNUMMark = ({ size = 1, fg = "#fff" }) => (
  <svg width={44 * size} height={44 * size} viewBox="0 0 44 44" fill="none">
    <rect x="1" y="1" width="42" height="42" rx="4" fill="none" stroke={fg} strokeWidth="1.5"/>
    <line x1="11" y1="15" x2="33" y2="15" stroke={fg} strokeWidth="2" strokeLinecap="round"/>
    <line x1="11" y1="22" x2="27" y2="22" stroke={fg} strokeWidth="2" strokeLinecap="round"/>
    <line x1="11" y1="29" x2="33" y2="29" stroke={fg} strokeWidth="2" strokeLinecap="round"/>
    <polyline points="27,19 33,22 27,25" fill="none" stroke={fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── DATA ────────────────────────────────────────────
const modules = [
  { num: "01", icon: "◈", title: "Übungsbibliothek", desc: "15 Kernübungen mit klarer Struktur, Progression und Coaching-Hinweisen für jeden Leistungsstand." },
  { num: "02", icon: "▣", title: "Trainingspläne", desc: "3 vollständige Pläne für Einsteiger, Mittelfeld und Fortgeschrittene – sofort einsetzbar." },
  { num: "03", icon: "◉", title: "Matchday-Protokoll", desc: "Von T-24h bis zum ersten Aufschlag – strukturierte Wettkampfvorbereitung auf Profiniveau." },
  { num: "04", icon: "✦", title: "Mentalitäts-Guide", desc: "Drucksituationen, Fokus-Rituale und Wettkampfpsychologie speziell für Tennistrainer." },
  { num: "05", icon: "◆", title: "Taktik & Analyse", desc: "Spielmuster, Gegneranalyse-Framework und Match-Analyse-Tools für den Trainingsalltag." },
];

const certLevels = [
  { icon: "⚪", name: "Certified Coach", color: "#d4d4d4", desc: "Basis-Zertifizierung nach Abschluss des Starter Packs.", for: "Einsteiger-Trainer" },
  { icon: "🟡", name: "Elite Coach", color: "#c8a96e", desc: "6 Monate aktive Nutzung & nachgewiesener Fortschritt.", for: "Erfahrene Trainer", soon: true },
  { icon: "🔵", name: "Accredited Club", color: "#1a3a5c", desc: "Offizielle Vereinszertifizierung durch SIGNUM.", for: "Sportvereine", soon: true },
  { icon: "🔴", name: "Performance Partner", color: "#8b0000", desc: "Höchste Qualitätsstufe – Kooperation & Audit.", for: "Top-Akademien", soon: true },
];

// ─── PAGES ───────────────────────────────────────────

function DNAPage() { return <div style={{ margin: "0 -40px" }}><PlayerDNAApp /></div>; }

function TennisPage({ setActive }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>

      {/* PLAYER DNA BANNER */}
      <div
        onClick={() => setActive("dna")}
        style={{ margin: "24px 0 32px", background: "linear-gradient(135deg, #00ff8712, #60efff06)", border: "1px solid #00ff8730", borderRadius: 18, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, #00ff8722, #60efff12)"; e.currentTarget.style.borderColor = "#00ff8760"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, #00ff8712, #60efff06)"; e.currentTarget.style.borderColor = "#00ff8730"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#00ff8718", border: "1px solid #00ff8740", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🧬</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Player DNA Test</span>
              <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", background: "#00ff8718", color: "#00ff87", border: "1px solid #00ff8740", padding: "2px 8px", borderRadius: 100 }}>NEU 🔥</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Welchem Profi ähnelst du? KI-Analyse in 90 Sek 👀</div>
          </div>
        </div>
        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>→</div>
      </div>

      {/* Hero */}
      <div style={{ padding: "32px 0 56px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>
          SIGNUM · Tennis · DACH
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 600, lineHeight: 1.05, marginBottom: 24, color: "#fff" }}>
          Trainiere wie<br/>
          <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>ein Professional.</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 480, lineHeight: 1.8, marginBottom: 36 }}>
          Das vollständige Coaching-System für Tennistrainer – strukturiert, praxisnah und anerkannt durch SIGNUM.
        </p>
        <button
          onClick={() => window.open('https://signum7.gumroad.com/l/ucqkbq')}
          style={{ background: "#fff", color: "#0a0a0a", border: "none", padding: "16px 36px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => e.target.style.background = "#e0ddd8"}
          onMouseLeave={e => e.target.style.background = "#fff"}
        >
          Starter Pack kaufen · 19€
        </button>
      </div>

      {/* Modules */}
      <div style={{ padding: "56px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 32 }}>Das Produkt</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: "#fff", marginBottom: 32 }}>
          Alles was du als Trainer <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>brauchst.</span>
        </h2>
        <div>
          {modules.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "stretch", borderBottom: "1px solid #1a1a1a", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#111"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 64, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "rgba(255,255,255,0.1)", borderRight: "1px solid #1a1a1a", flexShrink: 0, padding: "24px 0" }}>{m.num}</div>
              <div style={{ width: 52, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "rgba(255,255,255,0.25)", borderRight: "1px solid #1a1a1a", flexShrink: 0 }}>{m.icon}</div>
              <div style={{ padding: "24px 28px", flex: 1 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{m.desc}</div>
              </div>
              <div style={{ width: 52, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.15)", fontSize: 16 }}>→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification */}
      <div style={{ padding: "56px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 32 }}>Zertifizierung</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: "#fff", marginBottom: 32 }}>
          Deine Qualität. <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>Anerkannt.</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
          {certLevels.map(c => (
            <div key={c.name} style={{ background: "#111", padding: "28px 24px", position: "relative", opacity: c.soon ? 0.5 : 1 }}>
              {c.soon && (
                <div style={{ position: "absolute", top: 12, right: 12, fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", padding: "3px 7px" }}>Bald</div>
              )}
              <div style={{ fontSize: 28, marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: c.color, marginBottom: 8 }}>{c.name}</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</p>
              <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", border: `1px solid ${c.color}44`, color: c.color, padding: "3px 8px" }}>{c.for}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: "56px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 32 }}>Preise</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: "#fff", marginBottom: 32 }}>
          Starte <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>jetzt.</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 2 }}>
          {/* Active */}
          <div style={{ background: "#fff", padding: "40px 32px" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", background: "#0a0a0a", color: "#fff", display: "inline-block", padding: "4px 10px", marginBottom: 24 }}>Verfügbar · Launch-Preis</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 600, color: "#0a0a0a", lineHeight: 1 }}>19€</div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", marginTop: 4, marginBottom: 20 }}>einmalig · Erste 50 Käufer</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#0a0a0a", marginBottom: 8 }}>Starter Pack</div>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", lineHeight: 1.6, marginBottom: 24 }}>Das vollständige Coaching-System – sofort einsetzbar.</p>
            <ul style={{ listStyle: "none", marginBottom: 32 }}>
              {["Übungsbibliothek (15 Übungen)", "3 Trainingspläne", "Matchday-Protokoll", "Mentalitäts-Guide", "Taktik-Framework", "SIGNUM Certified Badge"].map((f, i) => (
                <li key={i} style={{ fontSize: 12, padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: 10, color: "rgba(0,0,0,0.6)" }}>
                  <span style={{ color: "rgba(0,0,0,0.25)" }}>—</span>{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => window.open('https://signum7.gumroad.com/l/ucqkbq')}
              style={{ width: "100%", background: "#0a0a0a", color: "#fff", border: "none", padding: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Jetzt kaufen
            </button>
          </div>

          {/* Coming Soon 1 */}
          <div style={{ background: "#111", padding: "40px 32px", opacity: 0.5 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", display: "inline-block", padding: "4px 10px", marginBottom: 24 }}>Bald verfügbar</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 600, color: "#fff", lineHeight: 1 }}>29€</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4, marginBottom: 20 }}>pro Monat</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 8 }}>Pro Mitgliedschaft</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Vollständiger Plattformzugang + Community + Kurse.</p>
          </div>

          {/* Coming Soon 2 */}
          <div style={{ background: "#111", padding: "40px 32px", opacity: 0.5 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", display: "inline-block", padding: "4px 10px", marginBottom: 24 }}>Bald verfügbar</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 600, color: "#fff", lineHeight: 1 }}>400€</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4, marginBottom: 20 }}>pro Jahr</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 8 }}>Club Accreditation</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>Offizielle SIGNUM-Zertifizierung für deinen Verein.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComingSoonPage({ title, subtitle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", animation: "fadeIn 0.4s ease" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 20 }}>In Vorbereitung</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 600, color: "#fff", marginBottom: 16, lineHeight: 1.1 }}>{title}</h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", maxWidth: 380, lineHeight: 1.7 }}>{subtitle}</p>
      <div style={{ marginTop: 48, display: "flex", gap: 2 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
        ))}
      </div>
    </div>
  );
}

function ShopPage() {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ padding: "64px 0 48px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>SIGNUM · Shop</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 600, color: "#fff", marginBottom: 16, lineHeight: 1.1 }}>
          Digitale Produkte &<br/><span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>Apparel.</span>
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 440, lineHeight: 1.7 }}>Unser Shop wird bald mit digitalen Produkten, Coaching-Materialien und der SIGNUM Bekleidungslinie erweitert.</p>
      </div>

      <div style={{ padding: "48px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2 }}>
          {/* Available */}
          <div style={{ background: "#fff", padding: "32px" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", background: "#0a0a0a", color: "#fff", display: "inline-block", padding: "4px 10px", marginBottom: 20 }}>Verfügbar</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#0a0a0a", marginBottom: 8 }}>Tennis Coach Starter Pack</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: "#0a0a0a", marginBottom: 16 }}>19€</div>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", lineHeight: 1.6, marginBottom: 20 }}>Das vollständige digitale Coaching-System für Tennistrainer.</p>
            <button onClick={() => window.open('https://signum7.gumroad.com/l/ucqkbq')} style={{ background: "#0a0a0a", color: "#fff", border: "none", padding: "12px 24px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
              Kaufen →
            </button>
          </div>

          {[
            { name: "SIGNUM Energy Booster", price: "19€ / 10er Box", desc: "Performance-Supplement für Matchday. Koffein, Elektrolyte, kein Zucker." },
            { name: "SIGNUM Coach Apparel", price: "ab 35€", desc: "Minimale Coaching-Bekleidung – schwarz, clean, professionell." },
            { name: "Pro Mitgliedschaft", price: "29€ / Monat", desc: "Vollständiger Plattformzugang, Community & monatliche Kurse." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#111", padding: "32px", opacity: 0.55 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", display: "inline-block", padding: "4px 10px", marginBottom: 20 }}>Bald</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{item.name}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#fff", opacity: 0.5, marginBottom: 16 }}>{item.price}</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImpressumPage() {
  const Block = ({ label, children }) => (
    <div style={{ padding: "40px 0", borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>{label}</div>
      {children}
    </div>
  );
  const T = ({ children, small }) => (
    <p style={{ fontSize: small ? 13 : 14, color: small ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.55)", lineHeight: small ? 1.8 : 2 }}>{children}</p>
  );
  return (
    <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 640 }}>
      <div style={{ padding: "64px 0 48px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>Rechtliches</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 600, color: "#fff", marginBottom: 12 }}>Impressum</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Angaben gemäß § 5 TMG</p>
      </div>

      <Block label="Betreiber">
        <T>
          Luis Schäfer<br/>
          Otto-Hahn-Str. 11<br/>
          67165 Waldsee<br/>
          Deutschland
        </T>
      </Block>

      <Block label="Kontakt">
        <T>E-Mail: joinsignum@gmail.com</T>
      </Block>

      <Block label="Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)">
        <T>Luis Schäfer<br/>Otto-Hahn-Str. 11, 67165 Waldsee</T>
      </Block>

      <Block label="Haftung für Inhalte">
        <T small>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</T>
      </Block>

      <Block label="Haftung für Links">
        <T small>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</T>
      </Block>

      <Block label="Urheberrecht">
        <T small>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</T>
      </Block>

      <div style={{ padding: "40px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>Hosting</div>
        <T small>Diese Website wird gehostet von Netlify Inc., 44 Montgomery Street, Suite 300, San Francisco, California 94104, USA. Mit Netlify wurde ein Vertrag zur Auftragsverarbeitung (AVV) geschlossen.</T>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────
const navItems = [
  { id: "dna", label: "Player DNA", icon: "🧬", available: true, badge: "NEU 🔥" },
  { id: "tennis", label: "Tennis", icon: "◈", available: true },
  { id: "fussball", label: "Fußball", icon: "◉", available: false },
  { id: "shop", label: "Shop", icon: "▣", available: true },
  { id: "impressum", label: "Impressum", icon: "◆", available: true },
];

const socialLinks = [
  { label: "TikTok", url: "https://www.tiktok.com/@signum478" },
  { label: "Instagram", url: "https://www.instagram.com/signumsports" },
];

export default function SIGNUMApp() {
  const [active, setActive] = useState("tennis");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch(active) {
      case "dna": return <DNAPage />;
      case "tennis": return <TennisPage setActive={setActive} />;
      case "fussball": return <ComingSoonPage title="Fußball kommt bald." subtitle="SIGNUM erweitert sein Coaching-System auf den Fußball. Strukturierte Trainingsmethodik, Matchday-Protokolle und Taktik-Frameworks für Fußballtrainer." />;
      case "shop": return <ShopPage />;
      case "impressum": return <ImpressumPage />;
      default: return <TennisPage />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        body { background: #0a0a0a; color: #fff; font-family: 'DM Sans', sans-serif; }

        .app { display: flex; min-height: 100vh; }

        /* SIDEBAR */
        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: #0d0d0d;
          border-right: 1px solid #1a1a1a;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
        }
        .sidebar-logo {
          padding: 32px 28px;
          border-bottom: 1px solid #1a1a1a;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sidebar-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: #fff;
        }
        .sidebar-nav {
          flex: 1;
          padding: 24px 0;
        }
        .sidebar-section-label {
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          padding: 0 28px;
          margin-bottom: 8px;
          margin-top: 20px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 28px;
          cursor: pointer;
          transition: all 0.15s;
          border-left: 2px solid transparent;
          position: relative;
        }
        .nav-item:hover { background: rgba(255,255,255,0.03); }
        .nav-item.active { border-left-color: #fff; background: rgba(255,255,255,0.04); }
        .nav-item.active .nav-label { color: #fff; }
        .nav-icon { font-size: 14px; color: rgba(255,255,255,0.3); width: 18px; text-align: center; }
        .nav-item.active .nav-icon { color: #fff; }
        .nav-label { font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 0.04em; }
        .nav-soon { font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 2px 6px; margin-left: auto; }

        .sidebar-social {
          padding: 24px 28px;
          border-top: 1px solid #1a1a1a;
        }
        .social-label { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-bottom: 12px; }
        .social-links { display: flex; gap: 16px; }
        .social-link {
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: color 0.2s;
        }
        .social-link:hover { color: #fff; }

        /* MAIN */
        .main {
          margin-left: 240px;
          flex: 1;
          padding: 0 64px;
          max-width: 960px;
        }

        /* MOBILE */
        .mobile-header {
          display: none;
          padding: 20px 24px;
          border-bottom: 1px solid #1a1a1a;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          background: rgba(10,10,10,0.95);
          backdrop-filter: blur(12px);
          z-index: 50;
        }
        .mobile-menu-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
          padding: 8px 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
        }
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          z-index: 90;
        }

        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); transition: transform 0.3s; }
          .sidebar.open { transform: translateX(0); }
          .mobile-header { display: flex; }
          .mobile-overlay { display: block; }
          .main { margin-left: 0; padding: 0 24px; }
        }
      `}</style>

      <div className="app">
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <SIGNUMMark size={0.65} fg="#fff" />
            <span className="sidebar-logo-name">SIGNUM</span>
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Sportarten</div>
            {navItems.slice(0, 2).map(item => (
              <div
                key={item.id}
                className={`nav-item ${active === item.id ? "active" : ""}`}
                onClick={() => { setActive(item.id); setMobileMenuOpen(false); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {!item.available && <span className="nav-soon">Bald</span>}
                {item.badge && <span className="nav-soon" style={{ color: "#ff6b35", borderColor: "#ff6b3540", background: "#ff6b3510" }}>{item.badge}</span>}
              </div>
            ))}

            <div className="sidebar-section-label">Allgemein</div>
            {navItems.slice(2).map(item => (
              <div
                key={item.id}
                className={`nav-item ${active === item.id ? "active" : ""}`}
                onClick={() => { setActive(item.id); setMobileMenuOpen(false); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
            ))}
          </nav>

          <div className="sidebar-social">
            <div className="social-label">Folge uns</div>
            <div className="social-links">
              <span className="social-link" onClick={() => window.open('https://www.tiktok.com/@signum478', '_blank')}>TikTok</span>
              <span className="social-link" onClick={() => window.open('https://www.instagram.com/signumsports', '_blank')}>Instagram</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main">
          {/* Mobile Header */}
          <div className="mobile-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SIGNUMMark size={0.55} fg="#fff" />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, letterSpacing: "0.2em" }}>SIGNUM</span>
            </div>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              Menü
            </button>
          </div>

          {renderPage()}
        </main>
      </div>
    </>
  );
}
          
