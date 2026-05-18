import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.5 + 0.2,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${p.o})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={styles.root}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <nav style={styles.nav}>
        <span style={styles.logo}>Vani<span style={styles.ai}>AI</span></span>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button style={styles.navBtn} onClick={() => navigate("/demo")}>🆓 Demo</button>
          <button style={styles.navBtn} onClick={() => navigate("/jobs")}>💼 Jobs</button>
          <button style={styles.navBtn} onClick={() => navigate("/company")}>🏢 Companies</button>
          <button style={styles.navBtn} onClick={() => navigate("/admin")}>🔐 Admin</button>
          <button style={styles.navBtn} onClick={() => navigate("/language")}>Start Free</button>
        </div>
      </nav>
      <div style={styles.hero}>
        <div style={styles.badge}>🇮🇳 Built for Bharat · NSDC Aligned</div>
        <h1 style={styles.h1}>
          Speak Better.<br />
          <span style={styles.cyan}>Get Hired.</span>
        </h1>
        <p style={styles.sub}>
          India's first AI mock interviewer that understands Hinglish,
          measures your confidence, and scores you on national NSDC pillars — free.
        </p>
        <div style={styles.btnRow}>
          <button style={styles.primaryBtn} onClick={() => navigate("/language")}>
            🎤 Start Interview
          </button>
          <button style={styles.ghostBtn} onClick={() => navigate("/demo")}>
            📊 View Demo Dashboard
          </button>
        </div>
        <div style={styles.statsRow}>
          {[["50M+", "Students"], ["4 Pillars", "NSDC Score"], ["Real-time", "Feedback"]].map(([v, l]) => (
            <div key={l} style={styles.stat}>
              <span style={styles.statVal}>{v}</span>
              <span style={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "#020817", color: "#f1f5f9", fontFamily: "'Sora', sans-serif", position: "relative", overflow: "hidden" },
  canvas: { position: "absolute", inset: 0, zIndex: 0 },
  nav: { position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 3rem" },
  logo: { fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-1px", color: "#f1f5f9" },
  ai: { color: "#06b6d4" },
  navBtn: { background: "transparent", border: "1px solid #06b6d4", color: "#06b6d4", padding: "0.5rem 1.4rem", borderRadius: "999px", cursor: "pointer", fontSize: "0.9rem", fontFamily: "inherit" },
  hero: { position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "85vh", textAlign: "center", padding: "2rem" },
  badge: { background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: "#06b6d4", padding: "0.4rem 1.2rem", borderRadius: "999px", fontSize: "0.8rem", marginBottom: "2rem", letterSpacing: "0.05em" },
  h1: { fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-2px" },
  cyan: { color: "#06b6d4", textShadow: "0 0 40px rgba(6,182,212,0.4)" },
  sub: { maxWidth: "600px", color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2.5rem" },
  btnRow: { display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "3rem" },
  primaryBtn: { background: "linear-gradient(135deg,#06b6d4,#10b981)", border: "none", color: "#fff", padding: "0.9rem 2.2rem", borderRadius: "999px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 30px rgba(6,182,212,0.3)" },
  ghostBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", padding: "0.9rem 2.2rem", borderRadius: "999px", fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" },
  statsRow: { display: "flex", gap: "3rem", flexWrap: "wrap", justifyContent: "center" },
  stat: { display: "flex", flexDirection: "column", alignItems: "center" },
  statVal: { fontSize: "1.6rem", fontWeight: 800, color: "#06b6d4" },
  statLabel: { fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" },
};
