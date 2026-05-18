import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RadarChart from "../components/RadarChart";
import ScoreCard from "../components/ScoreCard";

const DEMO_RESULT = {
  overall: 76,
  wpm: 128,
  fillers: 2,
  silence_gaps: 1,
  scores: { empathy: 80, articulation: 75, grammar: 72, structure: 78 },
  hinglish_corrections: [{ original: "basically", suggestion: "essentially" }],
  tips: ["Use STAR method", "Avoid filler words", "Maintain steady pace"],
  transcript: "I am a BCA graduate with strong interest in customer support roles. I have handled difficult situations by staying calm and focused.",
};

export default function Demo() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro");
  const [timer, setTimer] = useState(0);
  const [recording, setRecording] = useState(false);
  const sc = DEMO_RESULT.scores;

  function speak(text) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.lang = "en-IN";
    speechSynthesis.speak(u);
  }

  function startDemo() {
    setPhase("recording");
    speak("Tell me about yourself.");
  }

  function handleMic() {
    if (!recording) {
      setRecording(true);
      let t = 0;
      const interval = setInterval(() => { t++; setTimer(t); }, 1000);
      setTimeout(() => { clearInterval(interval); setRecording(false); setPhase("result"); }, 8000);
    }
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (phase === "intro") return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.logo}>Vani<span style={s.cyan}>AI</span></span>
        <button style={s.ghostBtn} onClick={() => navigate("/")}>🏠 Home</button>
      </nav>
      <div style={s.center}>
        <div style={s.introCard}>
          <div style={s.glowBall} />
          <span style={s.freeBadge}>🆓 Free Demo · No Login Required</span>
          <h1 style={s.introTitle}>Experience VaniAI<br /><span style={s.cyan}>in 60 seconds</span></h1>
          <p style={s.introSub}>Answer 1 question. Get your AI score instantly.</p>
          <div style={s.featureGrid}>
            {["🎤 Real-time speech analysis", "📊 NSDC skill scoring", "🌐 Hinglish detection", "💡 Instant AI feedback"].map(f => (
              <div key={f} style={s.featureItem}>{f}</div>
            ))}
          </div>
          <button style={s.primaryBtn} onClick={startDemo}>🎤 Start Free Demo</button>
          <p style={s.hint}>Want full interview? <span style={s.link} onClick={() => navigate("/interview")}>Start now →</span></p>
        </div>
      </div>
    </div>
  );

  if (phase === "recording") return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.logo}>Vani<span style={s.cyan}>AI</span></span>
        <span style={s.pill}>Demo Mode</span>
      </nav>
      <div style={s.center}>
        <div style={s.recordCard}>
          <div style={s.aiAvatar}>🤖</div>
          <p style={s.phase}>{recording ? "🔴 Listening..." : "AI Interviewer"}</p>
          <div style={s.qBox}>
            <p style={s.question}>Tell me about yourself.</p>
          </div>
          {recording && (
            <>
              <p style={s.timerText}>{fmt(timer)}</p>
              <div style={s.waveContainer}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} style={{ ...s.bar, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </>
          )}
          <button onClick={handleMic} style={{ ...s.micBtn, ...(recording ? s.micActive : {}) }}>
            <span style={s.micIcon}>{recording ? "⏹" : "🎤"}</span>
            {recording && <span style={s.ripple} />}
          </button>
          <p style={s.hintText}>{!recording ? "Press mic to answer (8 sec demo)" : "Analyzing after 8 seconds..."}</p>
        </div>
      </div>
      <style>{`
        @keyframes wave { 0%,100%{height:8px} 50%{height:32px} }
        @keyframes ripple { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2);opacity:0} }
      `}</style>
    </div>
  );

  const overallColor = "#f59e0b";

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.logo}>Vani<span style={s.cyan}>AI</span></span>
        <div style={s.navRight}>
          <button style={s.ghostBtn} onClick={() => { setPhase("intro"); setTimer(0); }}>🔄 Retry</button>
          <button style={s.primaryBtn} onClick={() => navigate("/interview")}>🚀 Full Interview</button>
        </div>
      </nav>

      <div style={s.page}>
        <div style={s.demoBanner}>
          🆓 Demo Result — <span style={{ color: "#06b6d4" }}>Start full interview for complete 5-question analysis</span>
        </div>

        {/* Score Hero */}
        <div style={s.heroCard}>
          <div style={s.heroLeft}>
            <p style={s.heroLabel}>Demo Score</p>
            <div style={{ ...s.bigScore, color: overallColor }}>{DEMO_RESULT.overall}</div>
            <p style={s.heroSub}>out of 100 · NSDC Standard</p>
            <div style={s.metricRow}>
              {[["🗣️", "WPM", DEMO_RESULT.wpm, "120-150"], ["🔇", "Fillers", DEMO_RESULT.fillers, "<3"], ["⏸️", "Pauses", DEMO_RESULT.silence_gaps, "0"]].map(([icon, label, val, target]) => (
                <div key={label} style={s.metricBox}>
                  <span style={s.mIcon}>{icon}</span>
                  <span style={s.mVal}>{val}</span>
                  <span style={s.mLabel}>{label}</span>
                  <span style={s.mTarget}>Target: {target}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={s.heroRight}>
            <RadarChart scores={sc} />
          </div>
        </div>

        {/* NSDC Matrix */}
        <div style={s.section}>
          <h3 style={s.sectionTitle}>📊 NSDC Skill Matrix</h3>
          <div style={s.pillarGrid}>
            {[
              { label: "Customer Empathy & Tone", icon: "💬", key: "empathy" },
              { label: "Technical Articulation", icon: "🧠", key: "articulation" },
              { label: "Grammatical Integrity", icon: "📝", key: "grammar" },
              { label: "Sentence Structure", icon: "🏗️", key: "structure" },
            ].map(p => <ScoreCard key={p.key} label={p.label} icon={p.icon} score={sc[p.key]} />)}
          </div>
        </div>

        {/* Hinglish */}
        <div style={s.section}>
          <h3 style={s.sectionTitle}>🌐 Hinglish → Professional English</h3>
          {DEMO_RESULT.hinglish_corrections.map((c, i) => (
            <div key={i} style={s.correction}>
              <span style={s.original}>❌ "{c.original}"</span>
              <span style={s.arrow}>→</span>
              <span style={s.suggestion}>✅ "{c.suggestion}"</span>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div style={s.tipsCard}>
          <h3 style={s.sectionTitle}>💡 AI Improvement Tips</h3>
          <ul style={s.tips}>
            {DEMO_RESULT.tips.map((t, i) => <li key={i}>💡 {t}</li>)}
          </ul>
        </div>

        {/* CTA */}
        <div style={s.ctaCard}>
          <div style={s.ctaGlow} />
          <h2 style={s.ctaTitle}>Ready for the real thing?</h2>
          <p style={s.ctaSub}>5 questions · Full analytics · Save results · NSDC certificate</p>
          <div style={s.ctaBtns}>
            <button style={s.primaryBtn} onClick={() => navigate("/interview")}>🎤 Start Full Interview — Free</button>
            <button style={s.ghostBtn} onClick={() => navigate("/jobs")}>💼 Browse Job Openings</button>
          </div>
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
  navRight: { display: "flex", gap: "0.8rem" },
  pill: { background: "rgba(6,182,212,0.1)", color: "#06b6d4", padding: "0.3rem 1rem", borderRadius: "999px", fontSize: "0.85rem" },
  ghostBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", padding: "0.5rem 1.2rem", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" },
  primaryBtn: { background: "linear-gradient(135deg,#06b6d4,#10b981)", border: "none", color: "#fff", padding: "0.9rem 2rem", borderRadius: "999px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "85vh", padding: "2rem" },
  introCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "32px", padding: "3.5rem", maxWidth: "560px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", textAlign: "center", position: "relative", overflow: "hidden" },
  glowBall: { position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "200px", height: "200px", background: "radial-gradient(circle,rgba(6,182,212,0.15),transparent)", borderRadius: "50%", pointerEvents: "none" },
  freeBadge: { background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "0.4rem 1.2rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, border: "1px solid rgba(16,185,129,0.2)" },
  introTitle: { fontSize: "2.2rem", fontWeight: 900, lineHeight: 1.2, margin: 0 },
  introSub: { color: "#64748b", margin: 0 },
  featureGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", width: "100%" },
  featureItem: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "0.7rem 1rem", fontSize: "0.85rem", color: "#94a3b8", textAlign: "left" },
  hint: { color: "#64748b", fontSize: "0.85rem" },
  link: { color: "#06b6d4", cursor: "pointer" },
  recordCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: "28px", padding: "3rem 2.5rem", maxWidth: "520px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" },
  aiAvatar: { fontSize: "3rem", background: "rgba(6,182,212,0.1)", borderRadius: "50%", width: "72px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center" },
  phase: { color: "#06b6d4", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" },
  qBox: { background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.1)", borderRadius: "16px", padding: "1.5rem", width: "100%" },
  question: { fontSize: "1.1rem", lineHeight: 1.7, color: "#e2e8f0", textAlign: "center", margin: 0 },
  timerText: { fontSize: "1.8rem", fontWeight: 800, color: "#ef4444" },
  waveContainer: { display: "flex", alignItems: "center", gap: "4px", height: "40px" },
  bar: { width: "4px", background: "#06b6d4", borderRadius: "4px", animation: "wave 1s ease-in-out infinite" },
  micBtn: { position: "relative", width: "80px", height: "80px", borderRadius: "50%", border: "2px solid #06b6d4", background: "rgba(6,182,212,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  micActive: { border: "2px solid #ef4444", background: "rgba(239,68,68,0.15)" },
  micIcon: { fontSize: "2rem", zIndex: 1 },
  ripple: { position: "absolute", inset: "-8px", borderRadius: "50%", border: "2px solid #ef4444", animation: "ripple 1.2s ease-out infinite" },
  hintText: { color: "#64748b", fontSize: "0.85rem" },
  page: { maxWidth: "1000px", margin: "0 auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" },
  demoBanner: { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", padding: "0.8rem 1.5rem", color: "#94a3b8", fontSize: "0.9rem", textAlign: "center" },
  heroCard: { background: "linear-gradient(135deg,rgba(6,182,212,0.08),rgba(16,185,129,0.06))", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "28px", padding: "2.5rem", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" },
  heroLeft: { flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" },
  heroRight: { flex: 1, display: "flex", justifyContent: "center" },
  heroLabel: { color: "#64748b", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 },
  bigScore: { fontSize: "5rem", fontWeight: 900, lineHeight: 1, letterSpacing: "-3px" },
  heroSub: { color: "#64748b", fontSize: "0.9rem", margin: 0 },
  metricRow: { display: "flex", gap: "1.5rem", marginTop: "1rem", flexWrap: "wrap" },
  metricBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" },
  mIcon: { fontSize: "1.2rem" },
  mVal: { fontSize: "1.4rem", fontWeight: 800, color: "#06b6d4" },
  mLabel: { fontSize: "0.75rem", color: "#94a3b8" },
  mTarget: { fontSize: "0.7rem", color: "#475569" },
  section: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" },
  sectionTitle: { fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", margin: 0 },
  pillarGrid: { display: "flex", flexDirection: "column", gap: "0.8rem" },
  correction: { display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap", background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "0.8rem 1rem" },
  original: { color: "#ef4444", fontSize: "0.9rem" },
  arrow: { color: "#64748b" },
  suggestion: { color: "#10b981", fontSize: "0.9rem" },
  tipsCard: { background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "20px", padding: "1.8rem" },
  tips: { color: "#94a3b8", lineHeight: 2.2, paddingLeft: "1.2rem", fontSize: "0.95rem", margin: 0 },
  ctaCard: { background: "linear-gradient(135deg,rgba(6,182,212,0.1),rgba(16,185,129,0.1))", border: "1px solid rgba(6,182,212,0.25)", borderRadius: "28px", padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", position: "relative", overflow: "hidden" },
  ctaGlow: { position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "150px", background: "radial-gradient(circle,rgba(6,182,212,0.1),transparent)", pointerEvents: "none" },
  ctaTitle: { fontSize: "1.8rem", fontWeight: 900, margin: 0 },
  ctaSub: { color: "#64748b", margin: 0 },
  ctaBtns: { display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" },
};
