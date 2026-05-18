import { useNavigate, useLocation } from "react-router-dom";
import MicButton from "../components/MicButton";
import Waveform from "../components/Waveform";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useState, useEffect, useRef } from "react";

const QUESTIONS_BY_LANG = {
  en: [
    "Tell me about yourself and your career goals.",
    "Describe a challenge you faced and how you handled it.",
    "Why should we hire you for this role?",
    "Where do you see yourself in 5 years?",
    "What are your key strengths and one weakness?",
  ],
  hi: [
    "अपने बारे में बताइए और अपने करियर के लक्ष्य क्या हैं?",
    "किसी चुनौती के बारे में बताइए जिसे आपने कैसे संभाला?",
    "हमें आपको इस भूमिका के लिए क्यों चुनना चाहिए?",
    "आप 5 साल में खुद को कहाँ देखते हैं?",
    "आपकी मुख्य ताकत और एक कमजोरी क्या है?",
  ],
  te: [
    "మీ గురించి చెప్పండి మరియు మీ కెరీర్ లక్ష్యాలు ఏమిటి?",
    "మీరు ఎదుర్కొన్న సవాలు మరియు దాన్ని ఎలా నిర్వహించారు?",
    "మేము మిమ్మల్ని ఎందుకు నియమించుకోవాలి?",
    "5 సంవత్సరాల్లో మిమ్మల్ని మీరు ఎక్కడ చూస్తారు?",
    "మీ బలాలు మరియు ఒక బలహీనత ఏమిటి?",
  ],
  ta: [
    "உங்களைப் பற்றி சொல்லுங்கள் மற்றும் உங்கள் தொழில் இலக்குகள் என்ன?",
    "நீங்கள் எதிர்கொண்ட சவாலை எப்படி கையாண்டீர்கள்?",
    "இந்த பதவிக்கு நாங்கள் உங்களை ஏன் தேர்ந்தெடுக்க வேண்டும்?",
    "5 ஆண்டுகளில் நீங்கள் எங்கே இருப்பீர்கள்?",
    "உங்கள் முக்கிய பலம் மற்றும் ஒரு பலவீனம் என்ன?",
  ],
  mr: [
    "स्वतःबद्दल सांगा आणि तुमची करिअर उद्दिष्टे काय आहेत?",
    "तुम्ही सामोरे गेलेल्या आव्हानाबद्दल सांगा?",
    "आम्ही तुम्हाला या भूमिकेसाठी का निवडावे?",
    "5 वर्षांत तुम्ही स्वतःला कुठे पाहता?",
    "तुमची मुख्य शक्ती आणि एक कमजोरी काय आहे?",
  ],
};

export default function Interview() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const audioRef = useRef(null);
  const JOB_QUESTIONS = state?.job?.questions;
  const JOB_NAME = state?.job?.company;
  const LANGUAGE = state?.language || { code: "en", name: "English" };

  const QUESTIONS = JOB_QUESTIONS?.length > 0
    ? JOB_QUESTIONS
    : (QUESTIONS_BY_LANG[LANGUAGE.code] || QUESTIONS_BY_LANG.en);

  const [qIdx, setQIdx] = useState(0);
  const [phase, setPhase] = useState("ready");
  const [timer, setTimer] = useState(0);
  const [results, setResults] = useState([]);
  const { recording, startRecording, stopRecording, sendAudio } = useAudioRecorder();

  useEffect(() => {
  if (phase === "ready") speak(QUESTIONS[qIdx]);
}, [qIdx, phase]);

  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  async function speak(text) {
  const langMap = {
    en: "en-IN", hi: "hi-IN", te: "te-IN", ta: "ta-IN", mr: "mr-IN"
  };
  // Stop any playing audio first
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current = null;
  }
  speechSynthesis.cancel();
  try {
    const res = await fetch("http://localhost:8000/interview/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang: langMap[LANGUAGE.code] || "en-IN" }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioRef.current = new Audio(url);
    audioRef.current.play();
  } catch {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langMap[LANGUAGE.code] || "en-IN";
    speechSynthesis.speak(u);
  }
}

  async function handleMic() {
    if (!recording) {
      fetch("http://localhost:8000/counter/increment", { method: "POST" }).catch(() => {});
      setPhase("listening");
      await startRecording();
    } else {
      stopRecording();
      setPhase("processing");
      let result;
      try {
        result = await sendAudio(QUESTIONS[qIdx]);
      } catch {
        result = null;
      }

      const entry = {
        question: QUESTIONS[qIdx],
        company: JOB_NAME || null,
        role: state?.job?.role || null,
        language: LANGUAGE.name,
        transcript: result?.transcript || "No transcript",
        wpm: result?.wpm || 120,
        fillers: result?.fillers || 0,
        silence_gaps: result?.silence_gaps || 0,
        scores: result?.scores || { empathy: 70, articulation: 70, grammar: 70, structure: 70 },
        hinglish_corrections: result?.hinglish_corrections || [],
        tips: result?.tips || [],
        overall: result?.overall || 70,
      };

      const finalResults = [...results, entry];
      setResults(finalResults);

      if (qIdx < QUESTIONS.length - 1) {
        setQIdx((i) => i + 1);
        setPhase("ready");
      } else {
        navigate("/dashboard", { state: { results: finalResults } });
      }
    }
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={s.root}>
      <nav style={s.nav}>
        <span style={s.logo}>Vani<span style={s.cyan}>AI</span></span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {JOB_NAME && <span style={s.companyBadge}>🏢 {JOB_NAME} — {state?.job?.role}</span>}
          <span style={s.langBadge}>🌐 {LANGUAGE.name}</span>
          <span style={s.pill}>Q {qIdx + 1} / {QUESTIONS.length}</span>
        </div>
      </nav>

      <div style={s.center}>
        <div style={s.card}>
          <div style={s.avatar}>🤖</div>
          <p style={s.phase}>
            {phase === "ready" ? "AI Interviewer" : phase === "listening" ? "🔴 Listening..." : "⚙️ Analyzing..."}
          </p>
          <div style={s.qBox}>
            <p style={s.question}>{QUESTIONS[qIdx]}</p>
            <button style={s.readBtn} onClick={() => speak(QUESTIONS[qIdx])}>
              🔊 Read Question
            </button>
          </div>
          <Waveform active={recording} />
          {recording && <p style={s.timer}>{fmt(timer)}</p>}
          <MicButton recording={recording} onClick={handleMic} />
          <p style={s.hint}>{!recording ? "Press mic to answer" : "Press again to submit answer"}</p>
        </div>

        <div style={s.progress}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{ ...s.dot, ...(i < qIdx ? s.done : i === qIdx ? s.current : {}) }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.6)} }`}</style>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#020817", color: "#f1f5f9", fontFamily: "'Sora',sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  logo: { fontSize: "1.4rem", fontWeight: 800 },
  cyan: { color: "#06b6d4" },
  pill: { background: "rgba(6,182,212,0.1)", color: "#06b6d4", padding: "0.3rem 1rem", borderRadius: "999px", fontSize: "0.85rem" },
  langBadge: { background: "rgba(139,92,246,0.1)", color: "#a78bfa", padding: "0.3rem 1rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 },
  companyBadge: { background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "0.3rem 1rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 },
  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "88vh", gap: "2rem", padding: "2rem" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: "24px", padding: "3rem 2.5rem", maxWidth: "560px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", backdropFilter: "blur(20px)" },
  avatar: { fontSize: "3rem", background: "rgba(6,182,212,0.1)", borderRadius: "50%", width: "72px", height: "72px", display: "flex", alignItems: "center", justifyContent: "center" },
  phase: { color: "#06b6d4", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" },
  qBox: { background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.1)", borderRadius: "16px", padding: "1.5rem", width: "100%" },
  question: { fontSize: "1.1rem", lineHeight: 1.7, color: "#e2e8f0", textAlign: "center", margin: 0 },
  timer: { fontSize: "1.4rem", fontWeight: 700, color: "#ef4444" },
  hint: { color: "#64748b", fontSize: "0.85rem" },
  progress: { display: "flex", gap: "0.6rem" },
  dot: { width: "10px", height: "10px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" },
  done: { background: "#10b981" },
  current: { background: "#06b6d4", boxShadow: "0 0 8px #06b6d4" },
  readBtn: { background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4", padding: "0.4rem 1rem", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8rem", marginTop: "0.8rem" },
};
