"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
        quality={80}
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
          padding: "3rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <Image
          src="/ncf.webp"
          alt="NCF Logo"
          width={140}
          height={140}
          style={{ marginBottom: "2rem" }}
        />

        {/* Title */}
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Naga College Foundation Inc.
        </h1>

        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Electronic Central Supplies Record
        </h2>

        <p style={{ fontSize: "1.3rem", marginBottom: "3rem" }}>
          College of Health and Sciences
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            width: "100%",
            maxWidth: "600px",
            justifyContent: "center",
          }}
        >
          {/* STUDENT BUTTON */}
          <button
            onClick={() => router.push("/students")}
            style={{
              flex: 1,
              padding: "18px 0",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "40px",
              border: "none",
              backgroundColor: "#E6D85C",
              color: "black",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              transition: "0.3s",
            }}
          >
            Student
          </button>

          {/* INSTRUCTOR BUTTON */}
          <button
            onClick={() => router.push("/instructor")}
            style={{
              flex: 1,
              padding: "18px 0",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "40px",
              border: "none",
              backgroundColor: "#00B000",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              transition: "0.3s",
            }}
          >
            Clinical Instructor
          </button>
        </div>
      </div>
    </div>
  );
}