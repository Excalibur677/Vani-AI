import { useNavigate } from "react-router-dom";

const LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
];

export default function LanguageSelect() {
  const navigate = useNavigate();

  function select(lang) {
    navigate("/interview", { state: { language: lang } });
  }

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.logo}>Vani<span style={s.cyan}>AI</span></span>
        <button style={s.ghostBtn} onClick={() => navigate("/")}>🏠 Home</button>
      </nav>

      <div style={s.center}>
        <div style={s.card}>
          <div style={s.icon}>🌐</div>
          <h1 style={s.title}>Choose Your Language</h1>
          <p style={s.sub}>Interview questions will be asked in your preferred language</p>

          <div style={s.grid}>
            {LANGUAGES.map(lang => (
              <button key={lang.code} style={s.langBtn} onClick={() => select(lang)}>
                <span style={s.flag}>{lang.flag}</span>
                <span style={s.langName}>{lang.native}</span>
                <span style={s.langSub}>{lang.name}</span>
              </button>
            ))}
          </div>

          <p style={s.hint}>Don't worry — you can still mix languages while answering</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#020817", color: "#f1f5f9", fontFamily: "'Sora',sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  logo: { fontSize: "1.4rem", fontWeight: 800 },
  cyan: { color: "#06b6d4" },
  ghostBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", padding: "0.5rem 1.2rem", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "85vh", padding: "2rem" },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: "28px", padding: "3rem 2.5rem", maxWidth: "560px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", textAlign: "center" },
  icon: { fontSize: "3rem" },
  title: { fontSize: "1.8rem", fontWeight: 900, margin: 0 },
  sub: { color: "#64748b", margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width: "100%" },
  langBtn: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.2rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", transition: "all 0.2s", fontFamily: "inherit" },
  flag: { fontSize: "2rem" },
  langName: { fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" },
  langSub: { fontSize: "0.75rem", color: "#64748b" },
  hint: { color: "#475569", fontSize: "0.8rem" },
};
