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
      <motion.div
  style={{
    position: "absolute",
    inset: 0,
    zIndex: 0,
  }}
>
  <Image
    src="/green1.jpg"
    alt="Background"
    fill
    style={{ objectFit: "cover" }}
  />
</motion.div>

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
      <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
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
<motion.div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "1.5rem",
  }}
>
  {/* NCF LOGO (Floating) */}
  <motion.div
    animate={{ y: [0, -15, 0] }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Image
      src="/ncf.webp"
      alt="NCF Logo"
      width={140}
      height={140}
      style={{
        width: "clamp(80px,20vw,140px)",
        height: "auto",
      }}
    />
  </motion.div>

  {/* COINS LOGO */}
  <motion.div
    animate={{
      y: [0, -15, 0]
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Image
      src="/CHS.png"
      alt="Coins Stack"
      width={140}
      height={140}
      style={{
        width: "clamp(80px,20vw,140px)",
        height: "auto",
      }}
    />
  </motion.div>
</motion.div> 

        {/* Title */}
        <motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }}
>
  <motion.h1
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    style={{
      fontSize: "clamp(1.8rem,5vw,3rem)",
      fontWeight: "bold",
      marginBottom: "1rem",
    }}
  >
    Naga College Foundation Inc.
  </motion.h1>

  <motion.h2
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    style={{
      fontSize: "clamp(1.2rem,4vw,2rem)",
      marginBottom: "0.5rem",
    }}
  >
    Electronic Central Supplies Record
  </motion.h2>

  <motion.p
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    style={{
      fontSize: "clamp(1rem,3vw,1.3rem)",
      marginBottom: "2.5rem",
    }}
  >
    College of Health and Sciences
  </motion.p>
</motion.div>

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
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 300 }}
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
</motion.button>

          {/* INSTRUCTOR BUTTON */}
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 300 }}
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
          </motion.button>
        </div>
      </motion.div>

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
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: "#ffffff",
          color: "#111",
          padding: "28px",
          borderRadius: "12px",
          width: "340px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "600" }}>
            Admin Login
          </h2>

          <button
            onClick={() => setShowAdmin(false)}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* INPUTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "#555" }}>
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "4px",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", color: "#555" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loginAdmin()}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "4px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => setShowAdmin(false)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#f3f4f6",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={loginAdmin}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "#16a34a",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Login
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <ChatBot />
    </div>
  );
}