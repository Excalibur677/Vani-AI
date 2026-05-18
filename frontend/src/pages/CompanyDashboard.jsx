import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ company: "", role: "", type: "internship", questions: "", description: "" });
  const [posted, setPosted] = useState([]);
  const [msg, setMsg] = useState("");

  async function handlePost() {
    if (!form.company || !form.role || !form.questions) {
      setMsg("❌ Fill all fields"); return;
    }
    try {
      const res = await fetch("http://localhost:8000/company/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, questions: form.questions.split("\n").filter(Boolean) }),
      });
      const data = await res.json();
      setPosted(p => [data, ...p]);
      setMsg("✅ Posted successfully!");
      setForm({ company: "", role: "", type: "internship", questions: "", description: "" });
    } catch {
      setMsg("❌ Failed to post");
    }
  }

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.logo}>Vani<span style={s.cyan}>AI</span> <span style={s.badge}>Company</span></span>
        <button style={s.ghostBtn} onClick={() => navigate("/")}>🏠 Home</button>
      </nav>

      <div style={s.page}>
        <div style={s.formCard}>
          <h2 style={s.title}>Post a Job / Internship</h2>
          <p style={s.sub}>Add your opening and custom interview questions</p>

          <div style={s.fieldGrid}>
            <div style={s.field}>
              <label style={s.label}>Company Name</label>
              <input style={s.input} value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                placeholder="e.g. Infosys" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Role Title</label>
              <input style={s.input} value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Customer Support Executive" />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Type</label>
            <select style={s.input} value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="internship">Internship</option>
              <option value="job">Full-time Job</option>
            </select>
          </div>

          <div style={s.field}>
            <label style={s.label}>Job Description</label>
            <textarea style={{ ...s.input, height: "80px" }} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the role..." />
          </div>

          <div style={s.field}>
            <label style={s.label}>Interview Questions (one per line)</label>
            <textarea style={{ ...s.input, height: "120px" }} value={form.questions}
              onChange={e => setForm(f => ({ ...f, questions: e.target.value }))}
              placeholder={"Tell me about yourself.\nWhy do you want to join us?\nDescribe a challenge you faced."} />
          </div>

          {msg && <p style={{ color: msg.includes("✅") ? "#10b981" : "#ef4444", fontSize: "0.9rem" }}>{msg}</p>}

          <button style={s.primaryBtn} onClick={handlePost}>📤 Post Opening</button>
        </div>

        {posted.length > 0 && (
          <div style={s.section}>
            <h3 style={s.sectionTitle}>✅ Your Posted Openings</h3>
            {posted.map((p, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardTop}>
                  <span style={s.company}>{p.company}</span>
                  <span style={s.typeBadge}>{p.type}</span>
                </div>
                <p style={s.role}>{p.role}</p>
                <p style={s.desc}>{p.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#020817", color: "#f1f5f9", fontFamily: "'Sora',sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  logo: { fontSize: "1.4rem", fontWeight: 800 },
  cyan: { color: "#06b6d4" },
  badge: { background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "999px", marginLeft: "0.5rem" },
  ghostBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", padding: "0.5rem 1.2rem", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" },
  page: { maxWidth: "800px", margin: "0 auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" },
  formCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.2rem" },
  title: { fontSize: "1.5rem", fontWeight: 800, margin: 0 },
  sub: { color: "#64748b", fontSize: "0.9rem", margin: 0 },
  fieldGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.8rem 1rem", color: "#f1f5f9", fontFamily: "inherit", fontSize: "0.9rem", outline: "none", resize: "vertical" },
  primaryBtn: { background: "linear-gradient(135deg,#06b6d4,#10b981)", border: "none", color: "#fff", padding: "0.9rem 2rem", borderRadius: "999px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start" },
  section: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "1rem" },
  sectionTitle: { fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", margin: 0 },
  card: { background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "1rem 1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  company: { fontWeight: 700, color: "#06b6d4" },
  typeBadge: { background: "rgba(6,182,212,0.1)", color: "#06b6d4", fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "999px" },
  role: { fontWeight: 600, fontSize: "1rem", margin: 0 },
  desc: { color: "#64748b", fontSize: "0.85rem", margin: 0 },
};