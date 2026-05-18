import { useLocation, useNavigate } from "react-router-dom";
import ScoreCard from "../components/ScoreCard";
import RadarChart from "../components/RadarChart";



export default function Dashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const raw = state?.results?.[0] || state?.results;
if (!raw) { navigate("/"); return null; }
const data = Array.isArray(raw) ? raw[0] : raw;
  const sc = data?.scores || { empathy: 70, articulation: 70, grammar: 70, structure: 70 };
  const allResults = state?.results || [];
const avgWpm = Math.round(allResults.reduce((a, r) => a + (r.wpm || 120), 0) / (allResults.length || 1));
const totalFillers = allResults.reduce((a, r) => a + (r.fillers || 0), 0);
const totalSilence = allResults.reduce((a, r) => a + (r.silence_gaps || 0), 0);


  const avgOverall = Math.round(
  allResults.reduce((a, r) => a + (r.overall || 70), 0) / (allResults.length || 1)
);
const overallColor = avgOverall >= 80 ? "#10b981" : avgOverall >= 60 ? "#f59e0b" : "#ef4444";

  const pillars = [
    { label: "Customer Empathy & Tone", icon: "💬", key: "empathy" },
    { label: "Technical Articulation", icon: "🧠", key: "articulation" },
    { label: "Grammatical Integrity", icon: "📝", key: "grammar" },
    { label: "Sentence Structure", icon: "🏗️", key: "structure" },
  ];

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.logo}>Vani<span style={s.cyan}>AI</span></span>
        <div style={s.navRight}>
          <button style={s.ghostBtn} onClick={() => navigate("/interview")}>🔄 Retry</button>
          <button style={s.primaryBtn} onClick={() => navigate("/")}>🏠 Home</button>
        </div>
      </nav>

      <div style={s.page}>
        {/* Overall Score */}
        <div style={s.heroCard}>
  <p style={s.heroLabel}>Overall Interview Score</p>
  <div style={{ ...s.bigScore, color: overallColor }}>{avgOverall}</div>
  <p style={s.heroSub}>out of 100 · NSDC Standard · Based on {allResults.length} answers</p>
  {state?.results?.[0]?.company && (
  <p style={{ color: "#10b981", fontSize: "0.9rem", marginTop: "0.5rem" }}>
    🏢 {state.results[0].company} Interview
  </p>
)}
  <div style={s.metrics}>
    <Metric
      icon="🗣️" label="Avg WPM" val={avgWpm}
      good="120–150"
      status={avgWpm >= 120 && avgWpm <= 150 ? "good" : "bad"}
    />
    <Metric
      icon="🔇" label="Total Fillers" val={totalFillers}
      good="< 3"
      status={totalFillers <= 3 ? "good" : "bad"}
    />
    <Metric
      icon="⏸️" label="Long Pauses" val={totalSilence}
      good="0"
      status={totalSilence === 0 ? "good" : "bad"}
    />
    <Metric
      icon="📝" label="Questions" val={allResults.length}
      good="5"
      status="good"
    />
  </div>
</div>

        <div style={s.grid}>
          {/* NSDC Pillars */}
          <div style={s.section}>
            <h3 style={s.sectionTitle}>📊 NSDC Skill Matrix</h3>
            <div style={s.pillarGrid}>
              {pillars.map((p) => (
                <ScoreCard key={p.key} label={p.label} icon={p.icon} score={sc[p.key]} />
              ))}
            </div>
          </div>

          {/* Radar */}
          <div style={s.section}>
            <h3 style={s.sectionTitle}>🕸️ Skill Radar</h3>
            <div style={s.radarWrap}>
              <RadarChart scores={sc} />
            </div>
          </div>
        </div>

        {/* Hinglish Corrections */}
        {data.hinglish_corrections?.length > 0 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>🌐 Hinglish → Professional English</h3>
            <div style={s.correctionGrid}>
              {data.hinglish_corrections.map((c, i) => (
                <div key={i} style={s.correction}>
                  <span style={s.original}>❌ "{c.original}"</span>
                  <span style={s.arrow}>→</span>
                  <span style={s.suggestion}>✅ "{c.suggestion}"</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        <div style={s.section}>
  <h3 style={s.sectionTitle}>📄 Full Interview Transcript</h3>
  {state?.results?.map((r, i) => (
    <div key={i} style={s.qaBlock}>
      <p style={s.qText}>🤖 Q{i + 1}: {r.question}</p>
      <p style={s.aText}>🎤 You: {r.transcript || "No transcript captured"}</p>
    </div>
  ))}
</div>

        {/* Tips */}
        <div style={s.tipsCard}>
  <h3 style={s.sectionTitle}>💡 AI Improvement Tips</h3>
  <ul style={s.tips}>
    {/* LLM generated tips from all answers */}
    {state?.results?.flatMap(r => r.tips || [])
      .filter((tip, i, arr) => arr.indexOf(tip) === i) // remove duplicates
      .map((tip, i) => <li key={i}>💡 {tip}</li>)
    }
    {/* Audio metric tips */}
    {avgWpm < 120 && <li>🗣️ Speak faster — aim for 120–150 WPM</li>}
    {avgWpm > 150 && <li>🗣️ Slow down slightly for clarity</li>}
    {totalFillers > 2 && <li>🔇 You used {totalFillers} filler words — practice pausing instead</li>}
    {totalSilence > 0 && <li>⏸️ You had {totalSilence} long pauses — build answer templates</li>}
  </ul>
</div>
      </div>
    </div>
  );
}

function Metric({ icon, label, val, good, status }) {
  const color = status === "good" ? "#10b981" : "#ef4444";
  return (
    <div style={s.metric}>
      <span style={s.mIcon}>{icon}</span>
      <span style={{ ...s.mVal, color }}>{val}</span>
      <span style={s.mLabel}>{label}</span>
      <span style={s.mGood}>Target: {good}</span>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#020817", color: "#f1f5f9", fontFamily: "'Sora',sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  logo: { fontSize: "1.4rem", fontWeight: 800 },
  cyan: { color: "#06b6d4" },
  navRight: { display: "flex", gap: "0.8rem" },
  ghostBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", padding: "0.5rem 1.2rem", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" },
  primaryBtn: { background: "linear-gradient(135deg,#06b6d4,#10b981)", border: "none", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", fontWeight: 600 },
  page: { maxWidth: "1000px", margin: "0 auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" },
  heroCard: { background: "linear-gradient(135deg,rgba(6,182,212,0.08),rgba(16,185,129,0.08))", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "24px", padding: "2.5rem", textAlign: "center" },
  heroLabel: { color: "#64748b", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" },
  bigScore: { fontSize: "5rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-3px" },
  heroSub: { color: "#64748b", fontSize: "0.9rem", marginTop: "0.5rem", marginBottom: "2rem" },
  metrics: { display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" },
  metric: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" },
  mIcon: { fontSize: "1.4rem" },
  mVal: { fontSize: "1.6rem", fontWeight: 800, color: "#06b6d4" },
  mLabel: { fontSize: "0.75rem", color: "#94a3b8" },
  mGood: { fontSize: "0.7rem", color: "#475569" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" },
  section: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" },
  sectionTitle: { fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", margin: 0 },
  pillarGrid: { display: "flex", flexDirection: "column", gap: "0.8rem" },
  radarWrap: { display: "flex", justifyContent: "center" },
  correctionGrid: { display: "flex", flexDirection: "column", gap: "0.8rem" },
  correction: { display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap", background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "0.8rem 1rem" },
  original: { color: "#ef4444", fontSize: "0.9rem" },
  arrow: { color: "#64748b" },
  suggestion: { color: "#10b981", fontSize: "0.9rem" },
  transcript: { color: "#94a3b8", lineHeight: 1.8, fontSize: "0.95rem", margin: 0 },
  tipsCard: { background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "20px", padding: "1.8rem" },
  tips: { color: "#94a3b8", lineHeight: 2, paddingLeft: "1.2rem", fontSize: "0.95rem", margin: 0 },
  qaBlock: { borderLeft: "2px solid rgba(6,182,212,0.3)", paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" },
qText: { color: "#06b6d4", fontSize: "0.9rem", fontWeight: 600, margin: 0 },
aText: { color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 },
};
