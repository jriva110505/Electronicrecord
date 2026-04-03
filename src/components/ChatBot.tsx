"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  sender: "user" | "system";
  text: string;
  createdAt: string;
}

export default function StudentChatBox() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
  {
    sender: "system",
    text: "👋 Hello! Welcome to the support chat. How can we help you today?",
    createdAt: new Date().toISOString(),
  },
]);

  const apiUrl = "https://dbsupplyrecord-2.onrender.com";
  const guestId = useRef<string>("");

  

  // Initialize guest ID safely
  useEffect(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = `guest-${Date.now()}`;
      localStorage.setItem("guestId", id);
    }
    guestId.current = id;

    const storedName = localStorage.getItem("chatName");
    if (storedName) setSavedName(storedName);
  }, []);

  const studentId = savedName || guestId.current;

  // Save name
  const saveName = () => {
    if (!name.trim()) return;
    localStorage.setItem("chatName", name);
    setSavedName(name);
  };

  // Load messages from server
  const loadMessages = async () => {
    if (!studentId) return;

    try {
      const res = await fetch(`${apiUrl}/chat?studentId=${studentId}`);
      const data: Message[] = await res.json();

      if (Array.isArray(data)) {
        // Merge new messages without duplicates
        setMessages(prev => {
          const merged = [
            ...prev,
            ...data.filter(
              m =>
                !prev.some(
                  p => p.createdAt === m.createdAt && p.sender === m.sender && p.text === m.text
                )
            ),
          ];
          return merged;
        });
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  // Poll messages every 2s
  useEffect(() => {
    if (!studentId) return;
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [studentId]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !studentId) return;

    const newMsg: Message = {
      text: message,
      sender: "user",
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          studentName: savedName || "Guest",
          sender: "user",
          text: message,
        }),
      });

      // Append locally immediately
      setMessages(prev => [...prev, newMsg]);
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 60,
            height: 60,
            fontSize: 24,
            cursor: "pointer",
            zIndex: 9999,
          }}
        >
          💬
        </button>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 320,
            height: 420,
            background: "white",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#22c55e",
              color: "white",
              padding: 10,
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            Chat Support
            <span onClick={() => setOpen(false)} style={{ cursor: "pointer" }}>
              ✖
            </span>
          </div>

          {/* Name Input */}
          {!savedName && (
            <div style={{ padding: 10, borderBottom: "1px solid #eee" }}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name (optional)"
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    background: "white",   // make background white
                    color: "black",        // make text black
                    outline: "none",       // optional: remove default blue outline
                  }}
              />
              <button
                onClick={saveName}
                style={{
                  width: "100%",
                  padding: 8,
                  marginTop: 6,
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                Save Name
              </button>
            </div>
          )}

          

{/* Only show chat messages & input if name is saved */}
{savedName && (
  <>
    {/* Messages */}
    <div
      ref={chatRef}
      style={{
        flex: 1,
        padding: 10,
        overflowY: "auto",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.length > 0 ? (
        messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                padding: "8px 12px",
                borderRadius: 12,
                background: m.sender === "user" ? "#22c55e" : "#e5e7eb",
                color: m.sender === "user" ? "white" : "black",
                display: "inline-block",
                maxWidth: "80%",
              }}
            >
              {m.text}
            </span>
          </div>
        ))
      ) : (
        <div style={{ color: "#6b7280" }}>No messages yet</div>
      )}
    </div>

    {/* Input */}
    <div
      style={{
        display: "flex",
        padding: 10,
        gap: 6,
        borderTop: "1px solid #eee",
      }}
    >
      <input
  value={message}
  onChange={e => setMessage(e.target.value)}
  placeholder="Type a message..."
  style={{
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "white",   // make background white
    color: "black",        // make text black
    outline: "none",       // optional: remove default blue outline
  }}
  onKeyDown={e => e.key === "Enter" && sendMessage()}
/>
      <button
        onClick={sendMessage}
        style={{
          background: "#22c55e",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "0 12px",
        }}
      >
        ➤
      </button>
    </div>
  </>
)}
        </div>
      )}

    </>
  );
}