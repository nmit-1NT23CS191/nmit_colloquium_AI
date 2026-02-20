import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = async (queryText) => {
    const res = await axios.post("http://localhost:8000/ask/", {
      question: queryText
    });
    setAnswer(res.data.answer);
    speak(res.data.answer);
  };

  // 🔊 Text to Speech
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  // 🎤 Voice Recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      askAI(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
    };
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Ask AI (Voice Enabled)</h2>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about events..."
        style={{ width: "300px", marginRight: "10px" }}
      />

      <button onClick={() => askAI(question)}>Ask</button>

      <button onClick={startListening} style={{ marginLeft: "10px" }}>
        🎤 Speak
      </button>

      <p style={{ marginTop: "20px" }}>
        <b>Answer:</b> {answer}
      </p>
    </div>
  );
}