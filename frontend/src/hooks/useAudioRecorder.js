import { useRef, useState } from "react";

export function useAudioRecorder() {
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  async function startRecording() {
    chunks.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setAudioBlob(blob);
      stream.getTracks().forEach((t) => t.stop());
    };
    mediaRecorder.current.start(250);
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorder.current?.stop();
    setRecording(false);
  }

  async function sendAudio(question) {
    if (!audioBlob) return null;
    const form = new FormData();
    form.append("audio", audioBlob, "answer.webm");
    form.append("question", question);
    const res = await fetch("http://localhost:8000/interview/evaluate", {
      method: "POST",
      body: form,
    });
    return res.json();
  }

  return { recording, audioBlob, startRecording, stopRecording, sendAudio };
}
