export default function ScoreCard({ label, score, icon }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const pct = `${score}%`;

  return (
    <div style={s.card}>
      <div style={s.top}>
        <span style={s.icon}>{icon}</span>
        <span style={s.label}>{label}</span>
        <span style={{ ...s.score, color }}>{score}</span>
      </div>
      <div style={s.track}>
        <div style={{ ...s.bar, width: pct, background: color }} />
      </div>
    </div>
  );
}

const s = {
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" },
  top: { display: "flex", alignItems: "center", gap: "0.6rem" },
  icon: { fontSize: "1.2rem" },
  label: { flex: 1, fontSize: "0.9rem", color: "#94a3b8" },
  score: { fontSize: "1.4rem", fontWeight: 800 },
  track: { height: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "999px", overflow: "hidden" },
  bar: { height: "100%", borderRadius: "999px", transition: "width 1s ease" },
};
