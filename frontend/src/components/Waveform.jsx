import { useEffect, useRef } from "react";

export default function Waveform({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const c = canvas.getContext("2d");
        c.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    async function init() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      ctxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      sourceRef.current = audioCtx.createMediaStreamSource(stream);
      sourceRef.current.connect(analyser);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const buf = new Uint8Array(analyser.frequencyBinCount);

      function draw() {
        rafRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(buf);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barW = canvas.width / buf.length * 2.5;
        let x = 0;
        buf.forEach((val) => {
          const h = (val / 255) * canvas.height;
          const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - h);
          grad.addColorStop(0, "#06b6d4");
          grad.addColorStop(1, "#10b981");
          ctx.fillStyle = grad;
          ctx.fillRect(x, canvas.height - h, barW - 1, h);
          x += barW;
        });
      }
      draw();
    }

    init();
    return () => {
      cancelAnimationFrame(rafRef.current);
      ctxRef.current?.close();
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={80}
      style={{ borderRadius: "12px", background: "rgba(6,182,212,0.05)", width: "100%", maxWidth: "400px" }}
    />
  );
}
