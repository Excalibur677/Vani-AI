import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [pref, setPref] = useState({ name: "", role: "", company: "", type: "any" });
  const [prefSaved, setPrefSaved] = useState(false);

  async function submitPref() {
    try {
      await fetch("http://localhost:8000/student/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pref),
      });
    } catch {}
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  }
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/company/jobs")
      .then(r => r.json())
      .then(d => { setJobs(d); setLoading(false); })
      .catch(() => { setJobs([]); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? jobs : jobs.filter(j => j.type === filter);

  function startInterview(job) {
    navigate("/interview", { state: { job } });
  }

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.logo}>Vani<span style={s.cyan}>AI</span></span>
        <button style={s.ghostBtn} onClick={() => navigate("/")}>🏠 Home</button>
      </nav>

      <div style={s.page}>
        <div style={s.prefCard}>
          <h3 style={s.prefTitle}>🎯 What are you looking for?</h3>
          <div style={s.prefGrid}>
            <div style={s.field}>
              <label style={s.label}>Your Name</label>
              <input style={s.input} placeholder="e.g. Rahul Sharma"
                value={pref.name} onChange={e => setPref(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Target Role</label>
              <input style={s.input} placeholder="e.g. Customer Support"
                value={pref.role} onChange={e => setPref(p => ({ ...p, role: e.target.value }))} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Preferred Company</label>
              <input style={s.input} placeholder="e.g. Infosys or Any"
                value={pref.company} onChange={e => setPref(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Type</label>
              <select style={s.input} value={pref.type}
                onChange={e => setPref(p => ({ ...p, type: e.target.value }))}>
                <option value="any">Any</option>
                <option value="job">Full-time Job</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
          <button style={s.primaryBtn} onClick={submitPref}>
            {prefSaved ? "✅ Saved!" : "💾 Save Preference"}
          </button>
        </div>
        <div style={s.header}>
          <h1 style={s.title}>🏢 Job & Internship Openings</h1>
          <p style={s.sub}>Practice interviews for real companies. Get hired.</p>
        </div>

        <div style={s.filters}>
          {["all", "job", "internship"].map(f => (
            <button key={f} style={{ ...s.filterBtn, ...(filter === f ? s.activeFilter : {}) }}
              onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "job" ? "💼 Jobs" : "🎓 Internships"}
            </button>
          ))}
        </div>

        {loading && <p style={s.loading}>Loading openings...</p>}

        {!loading && filtered.length === 0 && (
          <div style={s.empty}>
            <p>No openings yet. Check back soon!</p>
          </div>
        )}

        <div style={s.grid}>
          {filtered.map((job, i) => (
            <div key={i} style={s.card}>
              <div style={s.cardTop}>
                <div>
                  <span style={s.company}>{job.company}</span>
                  <span style={s.typeBadge}>{job.type}</span>
                </div>
                <span style={s.date}>{new Date(job.posted_at).toLocaleDateString()}</span>
              </div>
              <h3 style={s.role}>{job.role}</h3>
              <p style={s.desc}>{job.description}</p>
              <div style={s.qCount}>
                📋 {job.questions?.length || 0} interview questions
              </div>
              <button style={s.primaryBtn} onClick={() => startInterview(job)}>
                🎤 Practice Interview
              </button>
            </div>
          ))}
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
  page: { maxWidth: "1000px", margin: "0 auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" },
  header: { textAlign: "center" },
  title: { fontSize: "2rem", fontWeight: 900, margin: 0 },
  sub: { color: "#64748b", marginTop: "0.5rem" },
  filters: { display: "flex", gap: "0.8rem", justifyContent: "center" },
  filterBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", padding: "0.5rem 1.2rem", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" },
  activeFilter: { background: "rgba(6,182,212,0.15)", border: "1px solid #06b6d4", color: "#06b6d4" },
  loading: { textAlign: "center", color: "#64748b" },
  empty: { textAlign: "center", color: "#64748b", padding: "3rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" },
  card: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  company: { fontWeight: 700, color: "#06b6d4", marginRight: "0.5rem" },
  typeBadge: { background: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "999px" },
  date: { color: "#475569", fontSize: "0.75rem" },
  role: { fontSize: "1.1rem", fontWeight: 700, margin: 0 },
  desc: { color: "#64748b", fontSize: "0.85rem", margin: 0, lineHeight: 1.6 },
  qCount: { color: "#94a3b8", fontSize: "0.8rem" },
  primaryBtn: { background: "linear-gradient(135deg,#06b6d4,#10b981)", border: "none", color: "#fff", padding: "0.7rem 1.5rem", borderRadius: "999px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: "0.5rem" },
  prefCard: { background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: "20px", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" },
  prefTitle: { fontSize: "1rem", fontWeight: 700, margin: 0 },
  prefGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.8rem 1rem", color: "#f1f5f9", fontFamily: "inherit", fontSize: "0.9rem", outline: "none" },

};