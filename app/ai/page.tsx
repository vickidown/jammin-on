"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey! 🎸 I'm your AI Jam Assistant. I can help you find jam sessions near you, or share music tips to level up your playing. What are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Unknown error");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>🎵</span>
        <div>
          <h1 style={styles.headerTitle}>AI Jam Assistant</h1>
          <p style={styles.headerSub}>Find jams · Get tips · Play more</p>
        </div>
      </div>

      {/* Chat window */}
      <div style={styles.chatWindow}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              ...(msg.role === "user" ? styles.userBubble : styles.aiBubble),
            }}
          >
            {msg.role === "assistant" && (
              <span style={styles.aiLabel}>🎸 Jam AI</span>
            )}
            <p style={styles.bubbleText}>{msg.text}</p>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.bubble, ...styles.aiBubble }}>
            <span style={styles.aiLabel}>🎸 Jam AI</span>
            <p style={{ ...styles.bubbleText, color: "#94a3b8" }}>
              Thinking<span style={styles.dots}>...</span>
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputRow}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about jam sessions near you, or get music tips..."
          rows={2}
          style={styles.textarea}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            ...styles.sendBtn,
            opacity: loading || !input.trim() ? 0.5 : 1,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      {/* Quick prompts */}
      <div style={styles.quickRow}>
        {[
          "Find jams near me 📍",
          "Tips for jamming with strangers 🤝",
          "Best gear for open mics 🎤",
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              setInput(prompt);
            }}
            style={styles.quickBtn}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px 20px",
    fontFamily: "'Georgia', serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
  },
  headerIcon: {
    fontSize: "48px",
  },
  headerTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#f8fafc",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  headerSub: {
    fontSize: "14px",
    color: "#64748b",
    margin: "4px 0 0",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  chatWindow: {
    width: "100%",
    maxWidth: "680px",
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    padding: "24px",
    minHeight: "360px",
    maxHeight: "50vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
  },
  bubble: {
    padding: "14px 18px",
    borderRadius: "12px",
    maxWidth: "85%",
  },
  userBubble: {
    backgroundColor: "#16a34a",
    alignSelf: "flex-end",
    borderBottomRightRadius: "4px",
  },
  aiBubble: {
    backgroundColor: "#334155",
    alignSelf: "flex-start",
    borderBottomLeftRadius: "4px",
  },
  aiLabel: {
    fontSize: "11px",
    color: "#94a3b8",
    display: "block",
    marginBottom: "6px",
    fontFamily: "monospace",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  bubbleText: {
    margin: 0,
    fontSize: "15px",
    color: "#f1f5f9",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
  },
  dots: {
    display: "inline-block",
    animation: "pulse 1.2s infinite",
  },
  inputRow: {
    width: "100%",
    maxWidth: "680px",
    display: "flex",
    gap: "12px",
    marginTop: "16px",
    alignItems: "flex-end",
  },
  textarea: {
    flex: 1,
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#f1f5f9",
    fontSize: "15px",
    resize: "none",
    outline: "none",
    fontFamily: "'Georgia', serif",
    lineHeight: "1.5",
  },
  sendBtn: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  quickRow: {
    width: "100%",
    maxWidth: "680px",
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  quickBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "20px",
    padding: "8px 16px",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};
