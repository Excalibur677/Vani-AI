export default function RadarChart({ scores }) {
  const labels = ["Empathy", "Articulation", "Grammar", "Structure"];
  const values = [scores.empathy, scores.articulation, scores.grammar, scores.structure];
  const cx = 150, cy = 150, r = 100;
  const levels = [25, 50, 75, 100];

  function polar(angle, val) {
    const rad = (angle * Math.PI) / 180;
    const d = (val / 100) * r;
    return { x: cx + d * Math.sin(rad), y: cy - d * Math.cos(rad) };
  }

  const n = labels.length;
  const angles = labels.map((_, i) => (360 / n) * i);
  const points = values.map((v, i) => polar(angles[i], v));
  const poly = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: "300px" }}>
      {levels.map((lv) => (
        <polygon
          key={lv}
          points={angles.map((a) => { const p = polar(a, lv); return `${p.x},${p.y}`; }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      ))}
      {angles.map((a, i) => {
        const p = polar(a, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />;
      })}
      <polygon points={poly} fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#06b6d4" />
      ))}
      {angles.map((a, i) => {
        const p = polar(a, 118);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="11">
            {labels[i]}
          </text>
        );
      })}
    </svg>
  );
}
