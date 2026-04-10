"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface WebEvent {
  name: string;
  date: string;
  location: string;
  description: string;
}

function parseWebEvents(text: string): WebEvent[] {
  const lines = text.split("\n");
  const events: WebEvent[] = [];
  for (const line of lines) {
    if (line.includes("ADD_TO_APP")) {
      const parts = line.replace(/^🌐\s*/, "").replace("| ADD_TO_APP", "").split("|");
      if (parts.length >= 3) {
        events.push({
          name: parts[0]?.trim() || "",
          date: parts[1]?.trim() || "",
          location: parts[2]?.trim() || "",
          description: parts[3]?.trim() || "",
        });
      }
    }
  }
  return events;
}

function cleanText(text: string): string {
  return text.replace(/\| ADD_TO_APP/g, "").replace(/^🌐 /gm, "🌐 ");
}

export default function AIPage() {
  const { isSignedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey! 🎸 I'm your AI Jam Assistant. I can find jam sessions from JamFinder AND search the web for events not yet listed. Try asking:\n\n• \"What jams are happening in London this week?\"\n• \"Find open mics in St. Thomas\"\n• \"Any blues jams near me this weekend?\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingEvent, setAddingEvent] = useState<string | null>(null);
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
      if (!res.ok || data.error) throw new Error(data.error || "Unknown error");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function addToJamFinder(event: WebEvent) {
    setAddingEvent(event.name);

    // Try to parse date, fallback to today
    let date = event.date;
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = new Date().toISOString().split("T")[0];
    }

    const { error } = await supabase.from("events").insert({
      title: event.name,
      date,
      location: event.location || "Ontario",
      lat: 42.777,
      lng: -81.183,
      type: "public",
      venue_type: "other",
      instruments: [],
      description: event.description || `Found via AI web search`,
    });

    setAddingEvent(null);

    if (error) {
      alert("Failed to add event. Please try again.");
      console.error(error);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: `✅ "${event.name}" has been added to JamFinder! It will now appear on the calendar and map.`,
      },
    ]);
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
          <p style={styles.headerSub}>JamFinder events · Web search · Add to app</p>
        </div>
      </div>

      {/* Chat window */}
      <div style={styles.chatWindow}>
        {messages.map((msg, i) => {
          const webEvents = msg.role === "assistant" ? parseWebEvents(msg.text) : [];
          const cleanedText = msg.role === "assistant" ? cleanText(msg.text) : msg.text;

          return (
            <div key={i}>
              <div
                style={{
                  ...styles.bubble,
                  ...(msg.role === "user" ? styles.userBubble : styles.aiBubble),
                }}
              >
                {msg.role === "assistant" && (
                  <span style={styles.aiLabel}>🎸 Jam AI</span>
                )}
                <p style={styles.bubbleText}>{cleanedText}</p>
              </div>

              {/* Add to JamFinder buttons for web-found events */}
              {webEvents.length > 0 && (
                <div style={styles.addEventContainer}>
                  {webEvents.map((event, idx) => (
                    <div key={idx} style={styles.addEventCard}>
                      <div>
                        <p style={styles.addEventName}>{event.name}</p>
                        <p style={styles.addEventMeta}>{event.date} · {event.location}</p>
                      </div>
                      <button
                        onClick={() => addToJamFinder(event)}
                        disabled={addingEvent === event.name}
                        style={styles.addEventBtn}
                      >
                        {addingEvent === event.name ? "Adding..." : "➕ Add to JamFinder"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div style={{ ...styles.bubble, ...styles.aiBubble }}>
            <span style={styles.aiLabel}>🎸 Jam AI</span>
            <p style={{ ...styles.bubbleText, color: "#94a3b8" }}>
              Searching JamFinder + the web...
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
          "Find jams in London this week 📍",
          "Open mics in St. Thomas 🎤",
          "Blues jams near me this weekend 🎸",
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => setInput(prompt)}
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
  headerIcon: { fontSize: "48px" },
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
    textTransform: "uppercase" as const,
  },
  chatWindow: {
    width: "100%",
    maxWidth: "680px",
    backgroundColor: "#1e293b",
    borderRadius: "16px",
    padding: "24px",
    minHeight: "360px",
    maxHeight: "50vh",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
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
    textTransform: "uppercase" as const,
  },
  bubbleText: {
    margin: 0,
    fontSize: "15px",
    color: "#f1f5f9",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap" as const,
  },
  addEventContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    marginTop: "8px",
    maxWidth: "85%",
  },
  addEventCard: {
    backgroundColor: "#1e3a5f",
    border: "1px solid #2d5a8e",
    borderRadius: "10px",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  addEventName: {
    margin: 0,
    fontSize: "14px",
    color: "#f1f5f9",
    fontWeight: "bold",
  },
  addEventMeta: {
    margin: "2px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },
  addEventBtn: {
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    shrink: 0,
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
    resize: "none" as const,
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
    whiteSpace: "nowrap" as const,
  },
  quickRow: {
    width: "100%",
    maxWidth: "680px",
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap" as const,
  },
  quickBtn: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "20px",
    padding: "8px 16px",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
  },
};
