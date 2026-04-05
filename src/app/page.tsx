"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBot from "@/components/ChatBot";

export default function Home() {
  const router = useRouter();
  const [showAdmin, setShowAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

// 🔹 Define multiple admin accounts
const admins = [
  { username: "admin", password: "admin" },
  { username: "SAxiena", password: "xiena" },
  { username: "SAjerome", password: "jerome" },
];

// 🔹 Login function
const loginAdmin = () => {
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  // 🔹 Check if credentials match any admin
  const admin = admins.find(
    (a) => a.username === trimmedUsername && a.password === trimmedPassword
  );

  if (admin) {
    // 🔹 Save logged-in username to localStorage
    localStorage.setItem("currentUser", admin.username);

    // 🔹 Redirect to admin page
    router.push("/admin");
  } else {
    alert("Invalid admin credentials");
  }
};


return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Background Image */}
      <Image
        src="/green.jpg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        quality={75}
        priority
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 0,
        }}
      />

      {/* ADMIN BUTTON */}
      <button
        onClick={() => setShowAdmin(true)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 2,
          padding: "10px 20px",
          borderRadius: "20px",
          border: "none",
          background: "#16a34a",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
        }}
      >
        Admin Login
      </button>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "clamp(1rem,4vw,3rem)",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Image
          src="/ncf.webp"
          alt="NCF Logo"
          width={140}
          height={140}
          style={{
            width: "clamp(80px,20vw,140px)",
            height: "auto",
            marginBottom: "1.5rem",
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(1.8rem,5vw,3rem)",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Naga College Foundation Inc.
        </h1>

        <h2
          style={{
            fontSize: "clamp(1.2rem,4vw,2rem)",
            marginBottom: "0.5rem",
          }}
        >
          Electronic Central Supplies Record
        </h2>

        <p
          style={{
            fontSize: "clamp(1rem,3vw,1.3rem)",
            marginBottom: "2.5rem",
          }}
        >
          College of Health and Sciences
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            width: "100%",
            maxWidth: "600px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* STUDENT BUTTON */}
          <button
            onClick={() => router.push("/students")}
            style={{
              flex: "1 1 220px",
              padding: "16px 0",
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: "40px",
              border: "none",
              backgroundColor: "#E6D85C",
              color: "black",
              cursor: "pointer",
            }}
          >
            Student
          </button>

          {/* INSTRUCTOR BUTTON */}
          <button
            onClick={() => router.push("/instructor")}
            style={{
              flex: "1 1 220px",
              padding: "16px 0",
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: "40px",
              border: "none",
              backgroundColor: "#00B000",
              color: "white",
              cursor: "pointer",
            }}
          >
            Clinical Instructor
          </button>
        </div>
      </div>

      {/* ADMIN LOGIN MODAL */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 50,
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                background: "white",
                color: "black",
                padding: "30px",
                borderRadius: "20px",
                width: "320px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                textAlign: "center",
              }}
            >
              <h2>Admin Login</h2>

              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <button
                onClick={loginAdmin}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#16a34a",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Login
              </button>

              <button
                onClick={() => setShowAdmin(false)}
                style={{
                  padding: "8px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatBot />
    </div>
  );
}