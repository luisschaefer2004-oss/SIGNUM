import React, { useState } from "react";

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

function TennisPage() {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      {/* Hero */}
      <div style={{ padding: "64px 0 56px", borderBottom: "1px solid #1a1a1a" }}>
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
      case "tennis": return <TennisPage />;
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
