
VaniAI 🎤
> **Speak Better. Get Hired.** 🚀

A real-time, context-aware AI mock interview platform designed for over 1.2 crore Indian graduates entering the job market annually. It bridges the gap between technical knowledge and communication barriers by offering tailored, dynamic, and native-language friendly coaching aligned with national NSDC standards.

---

## What it does 🤔

Most graduates from tier-2 and tier-3 cities have deep technical potential but lack access to affordable interview coaching. VaniAI solves this by simulating a realistic, end-to-end corporate interview experience:

### 🔄 The Core Loop
1. **Context Intake:** Upload your PDF resume and paste the target Job Description (JD). 📄
2. **Interactive Audio:** Instead of generic templates, the platform extracts your exact skills and matches them against the role requirements to generate custom questions spoken aloud. 🎯
3. **Speech Capture:** Listen and capture responses via the native browser microphone layer. 🗣️
4. **Deep Analytics:** Delivery metrics (WPM, filler words, silence gaps) are extracted directly from the audio via `librosa`. 📊
5. **LLM Evaluation:** A Groq-powered LLaMA 3.3 engine scores the response against updated 5-dimensional matrices and flags Hinglish regional slips with professional alternatives. 🧠
6. **Adaptive Progression:** The engine scales question difficulty (Easy ➡️ Medium ➡️ Hard) dynamically based on performance. 📈

---

## Key Features ✨

| Feature | Description | Status |
| :--- | :--- | :--- |
| **📄 Resume & JD Analysis** | Extracts skills, projects, and experiences from PDF resumes; cross-references with a pasted JD to generate highly targeted, role-specific questions. | **New 🔥** |
| **📈 Dynamic Difficulty Progression** | Tracks performance in real-time. Questions scale up (Easy ➡️ Medium ➡️ Hard) if answers are strong, and adaptively tone down if structural gaps are flagged. | **New 🔥** |
| **⏳ Per-Question Time Constraints** | Enforces strict, configurable timers per response. Answers exceeding thresholds are penalized within the time efficiency metric. | **New 🔥** |
| **🎯 Dual-Scoring Matrix** | Computes scores on 4 traditional NSDC pillars along with 5 core execution dimensions: Accuracy, Clarity, Depth, Relevance, and Time Efficiency. | **New 🔥** |
| **💼 Hiring Readiness Verdict** | Generates an explicit "Hire / Maybe / Not Ready" indicator mapped directly to the analyzed Job Description. | **New 🔥** |
| **💪 Strengths & Weaknesses** | Breaks down exact core competencies and communication blind spots along with structured tips. | **New 🔥** |
| **🎤 Live Voice Interview** | Real-time mic recording with low-latency Text-to-Speech (TTS) question playback. | Existing |
| **📊 Audio Analytics** | Measures Words Per Minute (WPM), tracks silence gaps, and counts filler words. | Existing |
| **🌐 Hinglish Intelligence** | Detects local language transitions and maps out professional English alternatives. | Existing |
| **🌍 Multilingual Engine** | Complete flow supported natively in English, Hindi, Telugu, Tamil, and Marathi. | Existing |

---

## Tech Stack 🛠️

### Frontend
* **React.js + Vite** — High-performance single-page architecture.
* **Tailwind CSS** — Sleek dark-mode interface accented with vibrant cyan and emerald tokens.
* **WebRTC MediaRecorder API** — Native browser-level microphone stream handling.
* **Web Speech API & Sarvam AI TTS** — Specialized low-latency Indian accent synthesis.

### Backend
* **FastAPI (Python)** — High-throughput async REST application layer.
* **PyPDF2 / PDFMiner** — Deterministic text extraction of skills and structures from resumes.
* **Groq Whisper API** — Lightning-fast, Indian-accent-optimized speech-to-text.
* **Groq LLaMA 3.3 70B** — Large language orchestrator handling multi-turn interview state, structural grading, and semantic analysis.
* **Librosa** — Advanced digital signal processing (DSP) for extraction of acoustic metadata (silence gaps, pitch shifts, speech rate).

---

## Updated Project Structure 📁

```text
vaniai/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/
│       │   ├── Landing.jsx           # Hero page
│       │   ├── LanguageSelect.jsx    # Language picker
│       │   ├── ResumeUpload.jsx      # Resume & JD Context Processing 🆕
│       │   ├── Interview.jsx         # Adaptive room with enforced timers 🆕
│       │   ├── Dashboard.jsx         # 5-Dimensional performance charts 🆕
│       │   ├── Demo.jsx              # Instant non-authenticated demo
│       │   ├── Jobs.jsx              # Active job boards
│       │   ├── CompanyDashboard.jsx  # Corporate configuration board
│       │   └── Admin.jsx             # Admin governance panel
│       ├── components/
│       │   ├── MicButton.jsx
│       │   ├── Waveform.jsx
│       │   ├── ScoreCard.jsx
│       │   └── RadarChart.jsx        # Expanded for 5-Dimensional visual profiles 🆕
│       └── hooks/
│           └── useAudioRecorder.js
│
└── backend/
    ├── main.py
    ├── requirements.txt
    ├── .env                          # Local credentials (git-ignored 🔐)
    ├── student_prefs.json            # Dynamic state tracker
    ├── company_jobs.json
    ├── routers/
    │   ├── interview.py              # Adaptive state engine & endpoint router
    │   ├── resume.py                 # Extractor & evaluator framework 🆕
    │   ├── session.py                # Time constraints & early termination 🆕
    │   ├── analytics.py
    │   └── admin.py
    └── services/
        ├── whisper_service.py
        ├── resumeparser.py           # Engine mapping resume strings 🆕
        ├── statemachine.py           # Difficulty & early exit orchestrator 🆕
        └── audio_analytics.py

```

---

## Evaluation Matrices 📊

### 1. Advanced Performance Metrics (5 Dimensions)

* **Accuracy:** Conceptual correctness regarding technical definitions and stacks.
* **Clarity:** Vowel articulation, stable speech pacing, and minimization of filler words.
* **Depth:** Comprehensiveness of answers, including implementation examples and edge cases.
* **Relevance:** Direct adherence to the question without rambling or tangential shifts.
* **Time Efficiency:** Precision of delivery staying within designated window limits.

### 2. NSDC Corporate Training Pillars

* **Customer Empathy & Tone:** Tone modulation, warmth, and customer-first alignment.
* **Technical Articulation:** Structural deployment of technical terminology.
* **Grammatical Integrity:** Multi-tense agreement and syntactic accuracy.
* **Sentence Structure:** Logical sequencing using an intro-body-conclusion format.

---

## Setup & Installation ⚙️

### Prerequisites

* Python 3.11
* Node.js 18+
* Groq API Key & Sarvam AI API Key

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

```

Configure your environment variables in a local `backend/.env` file:

```text
GROQ_API_KEY=your_groq_key_here
SARVAM_API_KEY=your_sarvam_key_here

```

Boot the application via Uvicorn:

```bash
py -3.11 -m uvicorn main:app --reload --port 8000

```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

Navigate to `http://localhost:5173` to test local endpoints.



## Monetization 💰

* **Tier 1 (Free):** 3 sessions/month, basic execution score tracking.
* **Tier 2 (Student Pro — ₹99/mo):** Unlimited evaluations, specialized deep metrics, and certificate issuing.
* **Tier 3 (Institutional):** Bulk pricing structures including direct management panels for campuses and enterprises.



## Team 👥

Built with ❤️ for Bharat's next generation of job seekers.

## License 📄

MIT License — Free to use, modify, and distribute.

