import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "vaniai2026";

export default function Admin() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState("");
  const [sessions, setSessions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState("sessions");
  const [error, setError] = useState("");

  function login() {
    if (pwd === ADMIN_PASSWORD) setAuth(true);
    else setError("❌ Wrong password");
  }

  useEffect(() => {
    if (!auth) return;
    fetch("http://localhost:8000/admin/sessions")
      .then(r => r.json()).then(setSessions).catch(() => {});
    fetch("http://localhost:8000/company/jobs")
      .then(r => r.json()).then(setJobs).catch(() => {});
  }, [auth]);

  if (!auth) return (
    <div style={s.root}>
      <div style={s.loginBox}>
        <h2 style={s.title}>🔐 Admin Login</h2>
        <input style={s.input} type="password" placeholder="Enter admin password"
          value={pwd} onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()} />
        {error && <p style={s.error}>{error}</p>}
        <button style={s.primaryBtn} onClick={login}>Login</button>
        <button style={s.ghostBtn} onClick={() => navigate("/")}>← Back</button>
      </div>
    </div>
  );

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.logo}>Vani<span style={s.cyan}>AI</span> <span style={s.badge}>Admin</span></span>
        <button style={s.ghostBtn} onClick={() => navigate("/")}>🏠 Home</button>
      </nav>

      <div style={s.page}>
        <div style={s.tabs}>
          {["sessions", "jobs"].map(t => (
            <button key={t} style={{ ...s.tab, ...(tab === t ? s.activeTab : {}) }}
              onClick={() => setTab(t)}>
              {t === "sessions" ? "📁 Interview Sessions" : "🏢 Company Jobs"}
            </button>
          ))}
        </div>

        {tab === "sessions" && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>📁 All Interview Sessions ({sessions.length})</h3>
            {sessions.length === 0 && <p style={s.empty}>No sessions yet.</p>}
            {sessions.map((s2, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardTop}>
                  <span style={s.company}>Session: {s2.session_id}</span>
                  <span style={s.date}>{s2.date}</span>
                </div>
                <p style={s.meta}>Overall: <b style={{ color: "#06b6d4" }}>{s2.overall}</b> · WPM: {s2.wpm} · Fillers: {s2.fillers}</p>
                <p style={s.transcript}>{s2.transcript?.slice(0, 150)}...</p>
                <a style={s.link} href={`http://localhost:8000/admin/download/${s2.session_id}`} target="_blank">
                  📥 Download Transcript
                </a>
              </div>
            ))}
          </div>
        )}

        {tab === "jobs" && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>🏢 All Job Postings ({jobs.length})</h3>
            {jobs.length === 0 && <p style={s.empty}>No jobs posted yet.</p>}
            {jobs.map((j, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardTop}>
                  <span style={s.company}>{j.company}</span>
                  <span style={s.typeBadge}>{j.type}</span>
                </div>
                <p style={s.role}>{j.role}</p>
                <p style={s.meta}>{j.questions?.length} questions · Posted {new Date(j.posted_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#020817", color: "#f1f5f9", fontFamily: "'Sora',sans-serif", display: "flex", flexDirection: "column" },
  loginBox: { margin: "auto", marginTop: "15vh", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "24px", padding: "3rem", display: "flex", flexDirection: "column", gap: "1rem", width: "360px" },
  title: { fontSize: "1.5rem", fontWeight: 800, margin: 0, textAlign: "center" },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.8rem 1rem", color: "#f1f5f9", fontFamily: "inherit", fontSize: "0.9rem", outline: "none" },
  error: { color: "#ef4444", fontSize: "0.85rem", margin: 0 },
  primaryBtn: { background: "linear-gradient(135deg,#06b6d4,#10b981)", border: "none", color: "#fff", padding: "0.9rem", borderRadius: "999px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  ghostBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", padding: "0.5rem 1.2rem", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  logo: { fontSize: "1.4rem", fontWeight: 800 },
  cyan: { color: "#06b6d4" },
  badge: { background: "rgba(239,68,68,0.15)", color: "#ef4444", fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "999px", marginLeft: "0.5rem" },
  page: { maxWidth: "900px", margin: "0 auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", width: "100%" },
  tabs: { display: "flex", gap: "0.8rem" },
  tab: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "0.6rem 1.4rem", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" },
  activeTab: { background: "rgba(6,182,212,0.15)", border: "1px solid #06b6d4", color: "#06b6d4" },
  section: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" },
  sectionTitle: { fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", margin: 0 },
  empty: { color: "#64748b", textAlign: "center", padding: "2rem" },
  card: { background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "1rem 1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  company: { fontWeight: 700, color: "#06b6d4", fontSize: "0.9rem" },
  date: { color: "#475569", fontSize: "0.75rem" },
  typeBadge: { background: "rgba(6,182,212,0.1)", color: "#06b6d4", fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "999px" },
  role: { fontWeight: 600, fontSize: "1rem", margin: 0 },
  meta: { color: "#94a3b8", fontSize: "0.85rem", margin: 0 },
  transcript: { color: "#64748b", fontSize: "0.8rem", margin: 0 },
  link: { color: "#06b6d4", fontSize: "0.85rem", textDecoration: "none" },
};