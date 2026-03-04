"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Supplies() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const router = useRouter();

  // Supplies per year
  const suppliesByLevel: Record<
    string,
    { name: string; img: string }[]
  > = {
    "1st": [
      { name: "Kidney Basin", img: "/kidney.png" },
      { name: "Forceps", img: "/forcep.png" },
      { name: "Clean Gloves", img: "/gloves.png" },
      { name: "Catheter", img: "/chateter.png" },
      { name: "Syringe", img: "/syringes.png" },
      { name: "Sterile Gloves", img: "/sterile.png" },
    ],
    "2nd": [
      { name: "BP Apparatus", img: "/bp.png" },
      { name: "Stethoscope", img: "/stetos.png" },
      { name: "Thermometer", img: "/termo.png" },
      { name: "Nebulizer", img: "/nebu.png" },
    ],
    "3rd": [
      { name: "IV Set", img: "/iv.png" },
      { name: "Oxygen Mask", img: "/mask.png" },
      { name: "Suction Catheter", img: "/cate.png" },
    ],
    "4th": [
      { name: "ECG Machine", img: "/ecg.png" },
      { name: "Defibrillator", img: "/defib.png" },
      { name: "Crash Cart", img: "/crashcart.png" },
    ],
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <Image
        src="/green.jpg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {!selectedLevel ? (
            /* ---------------- DESIGN 1 ---------------- */
            <motion.div
              key="level-selection"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "relative",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "white",
              }}
            >
              {/* BACK BUTTON */}
              <button
                onClick={() => router.push("/")}
                style={{
                  position: "absolute",
                  top: "30px",
                  right: "40px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "2px solid white",
                  background: "transparent",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#16a34a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                ← Back
              </button>

              <h1
                style={{
                  marginBottom: "3rem",
                  fontSize: "3rem",
                  fontWeight: "900",
                }}
              >
                WHAT'S YOUR YEAR LEVEL?
              </h1>

              <div
                style={{
                  display: "flex",
                  gap: "3rem",
                  flexWrap: "wrap",
                }}
              >
                {["1st", "2nd", "3rd", "4th"].map((level) => (
                  <motion.div
                    key={level}
                    whileHover={{
                      scale: 1.08,
                      backgroundColor: "#16a34a",
                      color: "#ffffff",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedLevel(level)}
                    style={{
                      background: "white",
                      width: "220px",
                      height: "220px",
                      borderRadius: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      color: "#111",
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                      boxShadow:
                        "0 20px 40px rgba(0,0,0,0.4)",
                    }}
                  >
                    {level} <br /> LEVEL
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ---------------- DESIGN 2 ---------------- */
            <motion.div
              key="supplies-page"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                height: "100vh",
                color: "black",
              }}
            >
              {/* SIDEBAR */}
              <div
                style={{
                  width: "260px",
                  background:
                    "linear-gradient(to bottom, #166534, #15803d)",
                  padding: "2rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  color: "white",
                }}
              >
                {["1st", "2nd", "3rd", "4th"].map((lvl) => (
                  <div
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      borderRadius: "12px",
                      background:
                        selectedLevel === lvl
                          ? "#22c55e"
                          : "rgba(255,255,255,0.2)",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                  >
                    {lvl} LEVEL
                  </div>
                ))}

                <button
                  onClick={() => setSelectedLevel(null)}
                  style={{
                    marginTop: "auto",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "white",
                    color: "#166534",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
              </div>

              {/* MAIN CONTENT */}
              <div
                style={{
                  flex: 1,
                  padding: "3rem",
                  background: "#f3f4f6",
                  overflowY: "auto",
                }}
              >
                <h2
                  style={{
                    marginBottom: "2rem",
                    fontSize: "2rem",
                  }}
                >
                  Electronic Central Supplies Record
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "2rem",
                  }}
                >
                  {suppliesByLevel[selectedLevel]?.map((item) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ scale: 1.04 }}
                      style={{
                        background: "white",
                        borderRadius: "20px",
                        minHeight: "260px",
                        padding: "1.5rem",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow:
                          "0 15px 35px rgba(0,0,0,0.15)",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "bold",
                        }}
                      >
                        {item.name}
                      </h3>

                      <Image
                        src={item.img}
                        alt={item.name}
                        width={120}
                        height={120}
                        style={{ objectFit: "contain" }}
                      />

                      <p
                        style={{
                          color: "#666",
                          fontSize: "1rem",
                        }}
                      >
                        Stock: 20
                      </p>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        style={{
                          position: "absolute",
                          bottom: "15px",
                          right: "15px",
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#16a34a",
                          color: "white",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          boxShadow:
                            "0 5px 15px rgba(0,0,0,0.3)",
                        }}
                      >
                        +
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}