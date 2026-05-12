import { useState, useEffect } from "react";

// ─── SHARED COMPONENTS ───────────────────────────────────────────

const SIGNUMMark = ({ size = 1, fg = "#fff", bg = "#0a0a0a" }) => {
  const s = 44 * size;
  return (
    <svg width={s} height={s} viewBox="0 0 44 44" fill="none">
      <rect x="1" y="1" width="42" height="42" rx="4" fill="none" stroke={fg} strokeWidth="1.5"/>
      <line x1="11" y1="15" x2="33" y2="15" stroke={fg} strokeWidth="2" strokeLinecap="round"/>
      <line x1="11" y1="22" x2="27" y2="22" stroke={fg} strokeWidth="2" strokeLinecap="round"/>
      <line x1="11" y1="29" x2="33" y2="29" stroke={fg} strokeWidth="2" strokeLinecap="round"/>
      <polyline points="27,19 33,22 27,25" fill="none" stroke={fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const Logo = ({ dark = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <SIGNUMMark size={0.7} fg={dark ? "#fff" : "#0a0a0a"} />
    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, letterSpacing: "0.22em", color: dark ? "#fff" : "#0a0a0a" }}>SIGNUM</span>
  </div>
);

// ─── AI COACH BOT ────────────────────────────────────────────────

const levelOptions = ["Einsteiger", "Mittelfeld", "Fortgeschritten", "Wettkampfspieler"];
const focusOptions = ["Technik & Schlagtechnik", "Matchday-Vorbereitung", "Mentalität & Druck", "Taktik & Spielmuster", "Athletik & Footwork", "Aufschlag & Return"];

function AICoachBot({ onClose }) {
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("");
  const [focus, setFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleSubmit = async () => {
    if (!age || !level || !focus) return;
    setLoading(true); setError(null); setResponse(null);
    const prompt = `Du bist SIGNUM Coach AI – ein professioneller Tenniscoach und Sportpsychologe.
Du analysierst das Profil eines Trainers oder Spielers und gibst sofort eine strukturierte, praxisnahe Trainingsempfehlung.

SPIELERPROFIL:
- Alter: ${age} Jahre
- Spielstärke: ${level}
- Trainingsfokus: ${focus}

Antworte auf Deutsch NUR als JSON (kein Text davor/danach):
{
  "analyse": "2-3 Sätze Kurzanalyse",
  "hauptuebung": { "name": "Name", "dauer": "z.B. 20 Min", "ablauf": ["Schritt 1","Schritt 2","Schritt 3"], "tipp": "Coach-Tipp" },
  "zusatzuebung": { "name": "Name", "dauer": "z.B. 10 Min", "beschreibung": "Kurzbeschreibung" },
  "mentalitaet": "Konkreter Mentalitäts-Tipp",
  "naechster_schritt": "Was als nächstes angehen"
}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResponse(parsed); setStep(2);
    } catch { setError("Verbindung fehlgeschlagen – bitte erneut versuchen."); }
    finally { setLoading(false); }
  };

  const reset = () => { setStep(1); setResponse(null); setAge(""); setLevel(""); setFocus(""); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 999, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      {/* Bot Header */}
      <div style={{ padding: "20px 28px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a0a", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SIGNUMMark size={0.6} fg="#fff" />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, letterSpacing: "0.2em", color: "#fff" }}>SIGNUM</span>
          <span style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.12)", padding: "3px 8px" }}>AI Coach · Live</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "1px solid #222", color: "rgba(255,255,255,0.4)", cursor: "pointer", width: 32, height: 32, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>✕</button>
      </div>

      {/* Bot Body */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

        {/* FORM */}
        {step === 1 && !loading && (
          <div style={{ width: "100%", maxWidth: 480, animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", textAlign: "center", marginBottom: 12 }}>Kostenlos · Sofort · Personalisiert</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 600, textAlign: "center", color: "#fff", marginBottom: 8, lineHeight: 1.1 }}>Dein persönlicher<br/>Trainingsplan.</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 36, lineHeight: 1.6 }}>Profil eingeben – SIGNUM AI antwortet sofort.</p>

            {[
              { label: "Dein Alter", content: <input type="number" min="8" max="80" placeholder="z.B. 24" value={age} onChange={e => setAge(e.target.value)} style={{ width: "100%", background: "#111", border: "1px solid #222", color: "#fff", padding: "14px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 15, outline: "none", MozAppearance: "textfield" }} /> },
              { label: "Spielstärke", content: <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{levelOptions.map(l => <button key={l} onClick={() => setLevel(l)} style={{ background: level === l ? "#fff" : "#111", border: `1px solid ${level === l ? "#fff" : "#222"}`, color: level === l ? "#0a0a0a" : "rgba(255,255,255,0.45)", padding: "12px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "left", transition: "all 0.15s" }}>{l}</button>)}</div> },
              { label: "Trainingsfokus", content: <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{focusOptions.map(f => <button key={f} onClick={() => setFocus(f)} style={{ background: focus === f ? "#fff" : "#111", border: `1px solid ${focus === f ? "#fff" : "#222"}`, color: focus === f ? "#0a0a0a" : "rgba(255,255,255,0.45)", padding: "12px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, textAlign: "left", transition: "all 0.15s", lineHeight: 1.3 }}>{f}</button>)}</div> },
            ].map(({ label, content }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>{label}</div>
                {content}
              </div>
            ))}

            <button disabled={!age || !level || !focus} onClick={handleSubmit} style={{ width: "100%", background: (!age || !level || !focus) ? "#222" : "#fff", color: (!age || !level || !focus) ? "#555" : "#0a0a0a", border: "none", padding: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", cursor: (!age || !level || !focus) ? "not-allowed" : "pointer", marginTop: 20, transition: "all 0.2s" }}>
              Training analysieren →
            </button>
            {error && <div style={{ marginTop: 10, fontSize: 12, color: "#ef4444", textAlign: "center" }}>{error}</div>}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "1px solid rgba(255,255,255,0.1)", borderTopColor: "rgba(255,255,255,0.6)", borderRadius: "50%", margin: "0 auto 24px", animation: "spin 1s linear infinite" }} />
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,0.5)", animation: "pulse 1.5s ease-in-out infinite" }}>SIGNUM analysiert dein Profil…</div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginTop: 8 }}>Trainingsplan wird erstellt</div>
          </div>
        )}

        {/* RESULT */}
        {step === 2 && response && (
          <div style={{ width: "100%", maxWidth: 600, animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #1a1a1a" }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: "#fff" }}>Dein Trainingsplan.</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  {[age + " Jahre", level, focus].map(t => <span key={t} style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.15)", padding: "3px 8px", color: "rgba(255,255,255,0.4)" }}>{t}</span>)}
                </div>
              </div>
              <SIGNUMMark size={0.6} fg="rgba(255,255,255,0.2)" />
            </div>

            {[
              { label: "◈ Analyse", content: <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{response.analyse}</p> },
              { label: "▣ Hauptübung", content: <div><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#fff", marginBottom: 4 }}>{response.hauptuebung?.name}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>⏱ {response.hauptuebung?.dauer}</div>{(response.hauptuebung?.ablauf || []).map((s, i) => <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" }}><div style={{ width: 22, height: 22, border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>{i+1}</div><span style={{ lineHeight: 1.5 }}>{s}</span></div>)}{response.hauptuebung?.tipp && <div style={{ background: "rgba(255,255,255,0.04)", borderLeft: "2px solid rgba(255,255,255,0.2)", padding: "8px 12px", fontSize: 12, color: "rgba(255,255,255,0.4)", fontStyle: "italic", marginTop: 10 }}>💡 {response.hauptuebung.tipp}</div>}</div> },
            ].map(({ label, content }) => (
              <div key={label} style={{ background: "#111", border: "1px solid #1a1a1a", padding: 22, marginBottom: 8 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>{label}</div>
                {content}
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div style={{ background: "#111", border: "1px solid #1a1a1a", padding: 22 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>◉ Zusatzübung</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#fff", marginBottom: 4 }}>{response.zusatzuebung?.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>⏱ {response.zusatzuebung?.dauer}</div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{response.zusatzuebung?.beschreibung}</p>
              </div>
              <div style={{ background: "#111", border: "1px solid #1a1a1a", padding: 22 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>✦ Mentalität</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{response.mentalitaet}</p>
              </div>
            </div>

            <div style={{ background: "#fff", padding: 22, marginBottom: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: 10 }}>◆ Nächster Schritt</div>
              <p style={{ fontSize: 14, color: "#0a0a0a", lineHeight: 1.7 }}>{response.naechster_schritt}</p>
            </div>

            <button onClick={reset} style={{ width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", padding: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
              ← Neues Profil analysieren
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN WEBSITE ────────────────────────────────────────────────

const certLevels = [
  { icon: "⚪", name: "Certified Coach", color: "#d4d4d4", desc: "Basis-Zertifizierung nach Abschluss des Starter Packs.", for: "Einsteiger-Trainer" },
  { icon: "🟡", name: "Elite Coach", color: "#c8a96e", desc: "6 Monate aktive Nutzung, Bewertungen & Fortschritt.", for: "Erfahrene Trainer" },
  { icon: "🔵", name: "Accredited Club", color: "#1a3a5c", desc: "Mindestens 3 zertifizierte Trainer im Verein.", for: "Sportvereine" },
  { icon: "🔴", name: "Performance Partner", color: "#8b0000", desc: "Kooperation, Audit & höchste Qualitätsstufe.", for: "Top-Akademien" },
];

const modules = [
  { num: "01", icon: "◈", title: "Übungsbibliothek", desc: "15 Kernübungen mit klarer Struktur, Progression und Coaching-Hinweisen." },
  { num: "02", icon: "▣", title: "Trainingspläne", desc: "3 vollständige Pläne für Einsteiger, Mittelfeld und Fortgeschrittene." },
  { num: "03", icon: "◉", title: "Matchday-Protokoll", desc: "Von T-24h bis zum ersten Aufschlag – strukturierte Wettkampfvorbereitung." },
  { num: "04", icon: "✦", title: "Mentalitäts-Guide", desc: "Drucksituationen, Fokus-Rituale und Wettkampfpsychologie für Trainer." },
  { num: "05", icon: "◆", title: "Taktik & Analyse", desc: "Spielmuster, Gegneranalyse-Framework und Match-Analyse-Tools." },
];

export default function SIGNUMWebsite() {
  const [scrolled, setScrolled] = useState(false);
  const [botOpen, setBotOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes bobFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes scrollLine { 0%,100%{opacity:0.15} 50%{opacity:0.5} }

        .w-root { background:#0a0a0a; color:#fff; font-family:'DM Sans',sans-serif; overflow-x:hidden; }

        .w-nav { position:fixed; top:0; left:0; right:0; z-index:100; transition:all 0.3s; border-bottom:1px solid transparent; }
        .w-nav.scrolled { background:rgba(10,10,10,0.95); border-bottom-color:#1a1a1a; backdrop-filter:blur(12px); }
        .w-nav-inner { display:flex; justify-content:space-between; align-items:center; padding:20px 40px; max-width:1100px; margin:0 auto; }
        .w-nav-links { display:flex; gap:28px; }
        .w-nav-link { background:none; border:none; color:rgba(255,255,255,0.4); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; transition:color 0.2s; }
        .w-nav-link:hover { color:#fff; }
        .w-nav-right { display:flex; gap:10px; align-items:center; }
        .w-nav-ai { background:none; border:1px solid rgba(255,255,255,0.2); color:rgba(255,255,255,0.6); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; padding:9px 18px; transition:all 0.2s; }
        .w-nav-ai:hover { border-color:#fff; color:#fff; }
        .w-nav-cta { background:#fff; border:none; color:#0a0a0a; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; padding:10px 20px; transition:all 0.2s; }
        .w-nav-cta:hover { background:#e0ddd8; }

        .w-hero { min-height:100vh; display:flex; flex-direction:column; justify-content:flex-end; padding:0 40px 80px; max-width:1100px; margin:0 auto; }
        .w-hero-eyebrow { font-size:10px; letter-spacing:0.4em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:24px; }
        .w-hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(52px,8vw,96px); font-weight:600; line-height:1.0; margin-bottom:28px; max-width:800px; }
        .w-hero-title em { font-style:italic; color:rgba(255,255,255,0.4); }
        .w-hero-sub { font-size:15px; color:rgba(255,255,255,0.45); max-width:440px; line-height:1.7; margin-bottom:40px; }
        .w-hero-actions { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .w-btn-primary { background:#fff; color:#0a0a0a; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; padding:16px 32px; transition:all 0.2s; }
        .w-btn-primary:hover { background:#e0ddd8; }
        .w-btn-ai { background:none; color:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.2); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; padding:16px 32px; transition:all 0.2s; }
        .w-btn-ai:hover { border-color:#fff; color:#fff; }
        .w-btn-ghost { background:none; color:rgba(255,255,255,0.4); border:1px solid rgba(255,255,255,0.12); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; padding:16px 32px; transition:all 0.2s; }
        .w-btn-ghost:hover { color:#fff; border-color:rgba(255,255,255,0.4); }

        .w-stats { display:flex; border-bottom:1px solid #1a1a1a; }
        .w-stat { flex:1; padding:40px; border-right:1px solid #1a1a1a; text-align:center; }
        .w-stat:last-child { border-right:none; }
        .w-stat-n { font-family:'Cormorant Garamond',serif; font-size:48px; font-weight:600; color:#fff; line-height:1; }
        .w-stat-l { font-size:10px; letter-spacing:0.25em; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-top:8px; }

        .w-section { padding:100px 40px; max-width:1100px; margin:0 auto; }
        .w-section-label { display:flex; align-items:center; gap:16px; margin-bottom:48px; }
        .w-section-line { width:32px; height:1px; background:rgba(255,255,255,0.2); }
        .w-section-tag { font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:rgba(255,255,255,0.3); }
        .w-section-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,5vw,52px); font-weight:600; line-height:1.1; max-width:600px; }
        .w-section-title em { font-style:italic; color:rgba(255,255,255,0.4); }

        .w-ai-section { background:#111; border-top:1px solid #1a1a1a; border-bottom:1px solid #1a1a1a; padding:80px 40px; }
        .w-ai-inner { max-width:1100px; margin:0 auto; display:flex; gap:80px; align-items:center; }
        .w-ai-text { flex:1; }
        .w-ai-title { font-family:'Cormorant Garamond',serif; font-size:42px; font-weight:600; margin-bottom:12px; line-height:1.1; }
        .w-ai-title em { font-style:italic; color:rgba(255,255,255,0.4); }
        .w-ai-sub { font-size:14px; color:rgba(255,255,255,0.4); line-height:1.7; margin-bottom:28px; max-width:400px; }
        .w-ai-preview { flex:1; background:#0a0a0a; border:1px solid #1a1a1a; padding:28px; }

        .w-problem-grid { display:grid; grid-template-columns:1fr 1fr; gap:2px; margin-top:48px; }
        .w-problem-card { background:#111; padding:36px; }
        .w-problem-x { font-size:20px; color:rgba(255,255,255,0.15); margin-bottom:16px; }
        .w-problem-text { font-size:15px; color:rgba(255,255,255,0.55); line-height:1.7; }

        .w-module-row { display:flex; align-items:stretch; border-bottom:1px solid #1a1a1a; transition:background 0.2s; }
        .w-module-row:first-child { border-top:1px solid #1a1a1a; }
        .w-module-row:hover { background:#111; }
        .w-module-num { width:80px; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:36px; color:rgba(255,255,255,0.1); border-right:1px solid #1a1a1a; flex-shrink:0; padding:28px 0; }
        .w-module-icon { width:60px; display:flex; align-items:center; justify-content:center; font-size:18px; color:rgba(255,255,255,0.3); border-right:1px solid #1a1a1a; flex-shrink:0; }
        .w-module-body { padding:28px 32px; flex:1; }
        .w-module-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; margin-bottom:6px; }
        .w-module-desc { font-size:13px; color:rgba(255,255,255,0.4); line-height:1.6; }
        .w-module-arrow { width:60px; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.15); font-size:18px; }

        .w-cert-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; margin-top:48px; }
        .w-cert-card { background:#111; padding:32px 24px; }
        .w-cert-icon { font-size:32px; margin-bottom:16px; }
        .w-cert-name { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; margin-bottom:8px; }
        .w-cert-desc { font-size:12px; color:rgba(255,255,255,0.4); line-height:1.6; margin-bottom:16px; }
        .w-cert-for { font-size:9px; letter-spacing:0.2em; text-transform:uppercase; border:1px solid; display:inline-block; padding:3px 8px; }

        .w-pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; margin-top:48px; }
        .w-price-card { background:#111; padding:40px 32px; }
        .w-price-card.feat { background:#fff; }
        .w-price-tag { font-size:9px; letter-spacing:0.25em; text-transform:uppercase; background:#0a0a0a; color:#fff; display:inline-block; padding:4px 10px; margin-bottom:24px; }
        .w-price-tag.feat { background:#0a0a0a; }
        .w-price-amount { font-family:'Cormorant Garamond',serif; font-size:52px; font-weight:600; line-height:1; }
        .w-price-period { font-size:12px; color:rgba(255,255,255,0.3); margin-top:4px; }
        .w-price-period.dk { color:rgba(0,0,0,0.4); }
        .w-price-name { font-size:14px; font-weight:500; margin:20px 0 8px; }
        .w-price-desc { font-size:12px; color:rgba(255,255,255,0.4); line-height:1.6; margin-bottom:24px; }
        .w-price-desc.dk { color:rgba(0,0,0,0.5); }
        .w-price-features { list-style:none; margin-bottom:32px; }
        .w-price-feat { font-size:12px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; gap:10px; color:rgba(255,255,255,0.6); }
        .w-price-feat.dk { color:rgba(0,0,0,0.6); border-bottom-color:rgba(0,0,0,0.08); }
        .w-price-feat span { color:rgba(255,255,255,0.25); }
        .w-price-feat.dk span { color:rgba(0,0,0,0.25); }
        .w-price-btn { width:100%; padding:14px; border:1px solid rgba(255,255,255,0.2); background:none; color:rgba(255,255,255,0.6); cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; transition:all 0.2s; }
        .w-price-btn:hover { border-color:#fff; color:#fff; }
        .w-price-btn.feat { background:#0a0a0a; color:#fff; border-color:#0a0a0a; }
        .w-price-btn.feat:hover { background:#1a1a1a; }

        .w-waitlist { background:#111; border-top:1px solid #1a1a1a; border-bottom:1px solid #1a1a1a; padding:80px 40px; }
        .w-waitlist-inner { max-width:1100px; margin:0 auto; display:flex; gap:80px; align-items:center; }
        .w-waitlist-title { font-family:'Cormorant Garamond',serif; font-size:40px; font-weight:600; margin-bottom:12px; }
        .w-waitlist-sub { font-size:14px; color:rgba(255,255,255,0.4); line-height:1.6; }
        .w-email-form { display:flex; gap:2px; flex:1; }
        .w-email-input { flex:1; background:#0a0a0a; border:1px solid #2a2a2a; color:#fff; padding:16px 20px; font-family:'DM Sans',sans-serif; font-size:14px; outline:none; }
        .w-email-input::placeholder { color:rgba(255,255,255,0.2); }
        .w-email-submit { background:#fff; color:#0a0a0a; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; padding:16px 28px; white-space:nowrap; transition:all 0.2s; }
        .w-email-submit:hover { background:#e0ddd8; }

        .w-footer { padding:48px 40px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #1a1a1a; max-width:1100px; margin:0 auto; }
        .w-footer-note { font-size:11px; color:rgba(255,255,255,0.2); letter-spacing:0.1em; }

        /* Floating AI Button */
        .w-fab { position:fixed; bottom:32px; right:32px; z-index:90; display:flex; align-items:center; gap:10px; background:#fff; color:#0a0a0a; border:none; cursor:pointer; padding:14px 22px; font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; box-shadow:0 8px 32px rgba(0,0,0,0.4); transition:all 0.2s; animation:bobFloat 3s ease-in-out infinite; }
        .w-fab:hover { background:#f0ede8; transform:translateY(-2px); box-shadow:0 12px 40px rgba(0,0,0,0.5); }
        .w-fab-dot { width:7px; height:7px; border-radius:50%; background:#34d399; animation:pulse 2s infinite; }

        @media(max-width:700px){
          .w-nav-links{display:none;}
          .w-problem-grid,.w-cert-grid,.w-pricing-grid{grid-template-columns:1fr;}
          .w-waitlist-inner,.w-ai-inner{flex-direction:column;gap:32px;}
          .w-email-form{flex-direction:column;}
          .w-section{padding:60px 24px;}
          .w-hero{padding:0 24px 60px;}
          .w-stats{flex-direction:column;}
          .w-stat{border-right:none;border-bottom:1px solid #1a1a1a;}
          .w-nav-inner{padding:16px 24px;}
          .w-fab{bottom:20px;right:20px;padding:12px 16px;}
        }
      `}</style>

      <div className="w-root">

        {/* AI Coach Overlay */}
        {botOpen && <AICoachBot onClose={() => setBotOpen(false)} />}

        {/* Floating Button */}
        {!botOpen && (
          <button className="w-fab" onClick={() => setBotOpen(true)}>
            <div className="w-fab-dot" />
            AI Coach testen
          </button>
        )}

        {/* NAV */}
        <nav className={`w-nav ${scrolled ? "scrolled" : ""}`}>
          <div className="w-nav-inner">
            <Logo dark />
            <div className="w-nav-links">
              {[["produkt","Produkt"],["zertifizierung","Zertifizierung"],["preise","Preise"]].map(([id,label]) => (
                <button key={id} className="w-nav-link" onClick={() => scrollTo(id)}>{label}</button>
              ))}
            </div>
            <div className="w-nav-right">
              <button className="w-nav-ai" onClick={() => setBotOpen(true)}>AI Coach</button>
              <button className="w-nav-cta" onClick={() => scrollTo("preise")}>Starter Pack</button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ background:"#0a0a0a", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"20%", right:"-5%", width:"50vw", height:"50vw", borderRadius:"50%", border:"1px solid rgba(255,255,255,0.03)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"30%", right:"5%", width:"35vw", height:"35vw", borderRadius:"50%", border:"1px solid rgba(255,255,255,0.03)", pointerEvents:"none" }} />
          <div className="w-hero">
            <div className="w-hero-eyebrow">Tennis · Coach Certification · DACH</div>
            <h1 className="w-hero-title">Trainiere wie<br/><em>ein Professional.</em><br/>Zertifiziert von SIGNUM.</h1>
            <p className="w-hero-sub">Das vollständige Coaching-System für Tennistrainer – von der Übungsbibliothek bis zum Matchday-Protokoll.</p>
            <div className="w-hero-actions">
              <button className="w-btn-primary" onClick={() => <button className="w-btn-primary" onClick={() => window.open('https://signum7.gumroad.com/l/ucqkbq')}>Starter Pack · 19€</button>}>Starter Pack · 19€</button>
              <button className="w-btn-ai" onClick={() => setBotOpen(true)}>AI Coach kostenlos testen</button>
              <button className="w-btn-ghost" onClick={() => scrollTo("produkt")}>Mehr erfahren</button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="w-stats">
          {[["5","Module"],["41+","Inhalte"],["4","Zertifizierungsstufen"],["∞","Skalierbar"]].map(([n,l]) => (
            <div key={l} className="w-stat"><div className="w-stat-n">{n}</div><div className="w-stat-l">{l}</div></div>
          ))}
        </div>

        {/* PROBLEM */}
        <div style={{ borderBottom:"1px solid #1a1a1a" }}>
          <div className="w-section">
            <div className="w-section-label"><div className="w-section-line"/><span className="w-section-tag">Das Problem</span></div>
            <h2 className="w-section-title">Was Trainern heute <em>fehlt.</em></h2>
            <div className="w-problem-grid">
              {["Keine einheitliche Trainingsmethodik – jeder Trainer erfindet das Rad neu.","Mentality & Matchday-Vorbereitung wird kaum strukturiert gelehrt.","Keine anerkannte Qualitätskennzeichnung außerhalb teurer Verbände.","Weiterbildungsangebote sind teuer, unflexibel und praxisfern."].map((p,i) => (
                <div key={i} className="w-problem-card"><div className="w-problem-x">✗</div><p className="w-problem-text">{p}</p></div>
              ))}
            </div>
          </div>
        </div>

        {/* AI COACH SECTION */}
        <div className="w-ai-section" id="aicoach">
          <div className="w-ai-inner">
            <div className="w-ai-text">
              <div style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:12 }}>Neu · SIGNUM AI</div>
              <h2 className="w-ai-title">Dein persönlicher<br/>Coach. <em>Sofort.</em></h2>
              <p className="w-ai-sub">Alter und Spielstärke eingeben – SIGNUM AI analysiert dein Profil und liefert sofort einen maßgeschneiderten Trainingsplan. Kostenlos, ohne Anmeldung.</p>
              <button className="w-btn-primary" onClick={() => setBotOpen(true)}>Jetzt kostenlos testen →</button>
            </div>
            <div className="w-ai-preview">
              <div style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", marginBottom:16 }}>Vorschau · AI Antwort</div>
              {[
                { label:"Analyse", text:"Für einen 22-jährigen Wettkampfspieler mit Fokus auf Matchday-Vorbereitung empfehle ich ein strukturiertes Aktivierungsprotokoll..." },
                { label:"Hauptübung", text:"Cross-Court Druckball · 20 Min · Intensität aufbauen unter matchnahen Bedingungen" },
                { label:"Mentalität", text:"Fokus-Reset zwischen den Punkten: 15 Sekunden, Saiten, Atmen, Plan." },
              ].map(({ label, text }) => (
                <div key={label} style={{ marginBottom:12, paddingBottom:12, borderBottom:"1px solid #1a1a1a" }}>
                  <div style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", marginBottom:6 }}>{label}</div>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>{text}</p>
                </div>
              ))}
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.2)", fontStyle:"italic" }}>Generiert in ~3 Sekunden · Kostenlos</div>
            </div>
          </div>
        </div>

        {/* PRODUCT */}
        <div style={{ borderBottom:"1px solid #1a1a1a" }}>
          <div className="w-section" id="produkt">
            <div className="w-section-label"><div className="w-section-line"/><span className="w-section-tag">Das Produkt</span></div>
            <h2 className="w-section-title">Alles was du als Trainer <em>brauchst.</em></h2>
            <div style={{ marginTop:48 }}>
              {modules.map((m,i) => (
                <div key={i} className="w-module-row">
                  <div className="w-module-num">{m.num}</div>
                  <div className="w-module-icon">{m.icon}</div>
                  <div className="w-module-body">
                    <div className="w-module-title">{m.title}</div>
                    <div className="w-module-desc">{m.desc}</div>
                  </div>
                  <div className="w-module-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CERTIFICATION */}
        <div style={{ borderBottom:"1px solid #1a1a1a" }}>
          <div className="w-section" id="zertifizierung">
            <div className="w-section-label"><div className="w-section-line"/><span className="w-section-tag">Zertifizierung</span></div>
            <h2 className="w-section-title">Deine Qualität. <em>Anerkannt.</em></h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.4)", maxWidth:500, lineHeight:1.7, marginTop:16 }}>SIGNUM verleiht Trainern und Vereinen eine anerkannte Zertifizierung – sichtbar nach außen, verdient durch echten Einsatz.</p>
            <div className="w-cert-grid">
              {certLevels.map(c => (
                <div key={c.name} className="w-cert-card">
                  <div className="w-cert-icon">{c.icon}</div>
                  <div className="w-cert-name" style={{ color:c.color }}>{c.name}</div>
                  <p className="w-cert-desc">{c.desc}</p>
                  <span className="w-cert-for" style={{ color:c.color, borderColor:c.color+"44" }}>{c.for}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div style={{ borderBottom:"1px solid #1a1a1a" }}>
          <div className="w-section" id="preise">
            <div className="w-section-label"><div className="w-section-line"/><span className="w-section-tag">Preise</span></div>
            <h2 className="w-section-title">Investiere in dein <em>Coaching.</em></h2>
            <div className="w-pricing-grid">
              {[
                { tag:"Einmalig", amount:"19€", period:"Launch-Preis · Erste 50 Käufer", name:"Starter Pack", feat:false, desc:"Alles was du brauchst um sofort strukturierter zu trainieren.", features:["Übungsbibliothek (15 Übungen)","3 Trainingspläne","Matchday-Protokoll","Mentalitäts-Guide","Taktik-Framework","SIGNUM Certified Badge"], btn:"Jetzt kaufen" },
                { tag:"Empfohlen", amount:"29€", period:"pro Monat", name:"Pro Mitgliedschaft", feat:true, desc:"Vollständiger Zugang zur Plattform + Community + Kurse.", features:["Alles aus Starter Pack","Monatliche neue Inhalte","Community-Zugang","Online-Kurse","Elite Coach Zertifizierung","Direkter Trainer-Support"], btn:"Pro werden" },
                { tag:"Verein", amount:"400€", period:"pro Jahr", name:"Club Accreditation", feat:false, desc:"Offizielle SIGNUM-Zertifizierung für deinen Verein.", features:["3+ Trainer-Lizenzen","Accredited Club Siegel","Physische Plakette","Vereins-Profil auf signum.io","Jahresaudit & Beratung","PR & Co-Marketing"], btn:"Verein anmelden" },
              ].map((p,i) => (
                <div key={i} className={`w-price-card ${p.feat?"feat":""}`}>
                  <div className={`w-price-tag ${p.feat?"feat":""}`}>{p.tag}</div>
                  <div className="w-price-amount" style={{ color:p.feat?"#0a0a0a":"#fff" }}>{p.amount}</div>
                  <div className={`w-price-period ${p.feat?"dk":""}`}>{p.period}</div>
                  <div className="w-price-name" style={{ color:p.feat?"#0a0a0a":"#fff" }}>{p.name}</div>
                  <p className={`w-price-desc ${p.feat?"dk":""}`}>{p.desc}</p>
                  <ul className="w-price-features">
                    {p.features.map((f,fi) => <li key={fi} className={`w-price-feat ${p.feat?"dk":""}`}><span>—</span>{f}</li>)}
                  </ul>
                  <button className={`w-price-btn ${p.feat?"feat":""}`}>{p.btn}</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WAITLIST */}
        <div className="w-waitlist">
          <div className="w-waitlist-inner">
            <div style={{ flex:1 }}>
              <div className="w-waitlist-title">Früh dabei sein.</div>
              <p className="w-waitlist-sub">Trag dich ein und bekomm den Launch-Preis von 19€ garantiert.</p>
            </div>
            {submitted ? (
              <div style={{ flex:1, textAlign:"center" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, marginBottom:8 }}>Danke. Wir melden uns.</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>Du bist auf der Liste. Launch-Preis gesichert.</div>
              </div>
            ) : (
              <div className="w-email-form">
                <input className="w-email-input" type="email" placeholder="deine@email.de" value={email} onChange={e => setEmail(e.target.value)} />
                <button className="w-email-submit" onClick={() => email && setSubmitted(true)}>Eintragen</button>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ background:"#0a0a0a" }}>
          <div className="w-footer">
            <Logo dark />
            <div style={{ display:"flex", gap:28 }}>
              {["Tennis","Coaching","Zertifizierung","Energy"].map(l => <span key={l} style={{ fontSize:11, color:"rgba(255,255,255,0.2)", letterSpacing:"0.1em" }}>{l}</span>)}
            </div>
            <div className="w-footer-note">© 2025 SIGNUM</div>
          </div>
        </div>
      </div>
    </>
  );
}
