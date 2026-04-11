"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id?: number;
  sender: "user" | "system";
  text: string;
  createdAt: string;
  read?: boolean;
}

export default function StudentChatBox() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false); // ✅ prevent double send

  const chatRef = useRef<HTMLDivElement>(null);
  const guestId = useRef<string>("");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "system",
      text: "👋 Hello! Welcome to the support chat. How can we help you today?",
      createdAt: new Date().toISOString(),
    },
  ]);

  const apiUrl = "https://dbsupplyrecord-2.onrender.com";

  // 🔹 Initialize guest ID + saved name
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

  // 🔹 Save name
  const saveName = () => {
    if (!name.trim()) return;
    localStorage.setItem("chatName", name);
    setSavedName(name);
  };

  // 🔹 Load messages (with strong dedupe)
  const loadMessages = async () => {
    if (!studentId) return;

    try {
      const res = await fetch(`${apiUrl}/chat?studentId=${studentId}`);
      const data: Message[] = await res.json();

      if (Array.isArray(data)) {
        setMessages(prev => {
          const map = new Map();

          [...prev, ...data].forEach(m => {
            const key = `${m.id || ""}-${m.createdAt}-${m.text}`;
            map.set(key, m);
          });

          return Array.from(map.values());
        });
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  // 🔹 Poll messages
  useEffect(() => {
    if (!studentId) return;
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [studentId]);

  // 🔹 Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // 🔥 SEND MESSAGE (FIXED)
  const sendMessage = async () => {
    if (!message.trim() || !studentId || isSending) return;

    setIsSending(true);

    const tempMessage = message;
    setMessage(""); // instant clear (Messenger feel)

    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          studentName: savedName || "Guest",
          sender: "user",
          text: tempMessage,
        }),
      });

      const savedMsg = await res.json();

      const newMsg: Message = {
        id: savedMsg.id,
        text: savedMsg.text,
        sender: savedMsg.sender,
        createdAt: savedMsg.createdAt,
        read: true,
      };

      setMessages(prev => {
        if (
          prev.some(
            m =>
              m.createdAt === newMsg.createdAt &&
              m.text === newMsg.text &&
              m.sender === newMsg.sender
          )
        ) {
          return prev;
        }
        return [...prev, newMsg];
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessage(tempMessage); // restore if failed
    }

    setTimeout(() => setIsSending(false), 300);
  };

  return (
    <>
      {/* OPEN BUTTON */}
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

      {/* CHAT BOX */}
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
          {/* HEADER */}
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

          {/* NAME INPUT */}
          {!savedName && (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <div style={{ width: "100%", maxWidth: 250 }}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name & Section"
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                />

                <button
                  onClick={saveName}
                  style={{
                    width: "100%",
                    padding: 10,
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Save Name
                </button>
              </div>
            </div>
          )}

          {/* CHAT AREA */}
          {savedName && (
            <>
              {/* MESSAGES */}
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
                {messages.map((m, i) => (
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
                        background:
                          m.sender === "user" ? "#22c55e" : "#e5e7eb",
                        color: m.sender === "user" ? "white" : "black",
                        display: "inline-block",
                        maxWidth: "80%",
                      }}
                    >
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* INPUT */}
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
                    background: "white",
                    color: "black",
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !isSending) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />

                <button
                  onClick={sendMessage}
                  disabled={isSending}
                  style={{
                    background: isSending ? "#9ca3af" : "#22c55e",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "0 12px",
                    cursor: isSending ? "not-allowed" : "pointer",
                  }}
                >
                  {isSending ? "..." : "➤"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}