export default function MicButton({ recording, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.btn, ...(recording ? styles.active : {}) }}>
      <span style={styles.icon}>{recording ? "⏹" : "🎤"}</span>
      {recording && <span style={styles.pulse} />}
    </button>
  );
}

const styles = {
  btn: {
    position: "relative",
    width: "90px", height: "90px",
    borderRadius: "50%",
    border: "2px solid #06b6d4",
    background: "rgba(6,182,212,0.1)",
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.3s",
    boxShadow: "0 0 20px rgba(6,182,212,0.2)",
  },
  active: {
    background: "rgba(239,68,68,0.15)",
    border: "2px solid #ef4444",
    boxShadow: "0 0 30px rgba(239,68,68,0.3)",
  },
  icon: { fontSize: "2rem", zIndex: 1 },
  pulse: {
    position: "absolute",
    inset: "-8px",
    borderRadius: "50%",
    border: "2px solid #ef4444",
    animation: "pulse 1.2s ease-out infinite",
  },
};
