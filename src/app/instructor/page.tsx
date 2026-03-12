"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, JSX } from "react";
import { motion } from "framer-motion";

interface FormData {
  instructor: string;
  course: string;
  studentName: string;
  studentId: string;
  date: string;
  time: string;
}

export default function About(): JSX.Element {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    instructor: "",
    course: "",
    studentName: "",
    studentId: "",
    date: "",
    time: "",
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "studentId") {
      // Remove non-numeric characters
      let numeric = value.replace(/\D/g, "");
      numeric = numeric.slice(0, 7); // Max 7 digits

      // Auto-insert dash after first 2 digits
      if (numeric.length > 2) {
        numeric = numeric.slice(0, 2) + "-" + numeric.slice(2);
      }

      setFormData({
        ...formData,
        studentId: numeric,
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === "date" || name === "time" ? value : value.toUpperCase(),
      });
    }
  };

  // Prevent pasting invalid Student ID
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text");
    const numeric = paste.replace(/\D/g, "");
    if (!/^\d{1,7}$/.test(numeric)) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Submitted Successfully!");
    router.push("/supplies");
  };

  const handleClear = () => {
    setFormData({
      instructor: "",
      course: "",
      studentName: "",
      studentId: "",
      date: "",
      time: "",
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ minHeight: "100vh", backgroundColor: "#f0f0f0", position: "relative" }}
    >
      {/* FLOATING BACK BUTTON */}
      <motion.button
        onClick={handleBack}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "absolute",
          top: "130px",
          right: "40px",
          backgroundColor: "#ffffff",
          color: "#2e7d32",
          border: "none",
          borderRadius: "20px",
          padding: "8px 18px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        ← Back
      </motion.button>

      {/* HEADER */}
      <div
        style={{
          padding: "20px 40px",
          background: "linear-gradient(to right, #7bc67b, #b8e6b8)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          Electronic Central Supplies Record
        </h2>

        <Image
          src="/ncf.webp"
          alt="Logo"
          width={60}
          height={60}
          style={{ borderRadius: "50%" }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: "10px", maxWidth: "1200px", margin: "30px auto" }}>
        <h1
          style={{
            letterSpacing: "2px",
            fontSize: "28px",
            marginBottom: "40px",
          }}
        >
          INSTRUCTOR INFORMATION
        </h1>

        {/* CENTERED WIDE FORM */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              width: "100%",
              maxWidth: "1100px",
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {/* CLEAR BUTTON */}
            <motion.button
              onClick={handleClear}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                backgroundColor: "#ff5252",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "6px 14px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              CLEAR
            </motion.button>

            <form onSubmit={handleSubmit}>
              <InputField
                label="NAME OF THE CLINICAL INSTRUCTOR *"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="MR./MS. LASTNAME, FIRSTNAME, M.I."
                required
              />

              <InputField
                label="COURSE *"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="BACHELOR OF SCIENCE IN NURSING"
                required
              />

              <InputField
                label="NAME OF THE STUDENTS (OPTIONAL)"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="LASTNAME, FIRSTNAME, M.I."
              />

              <InputField
                label="STUDENT ID NUMBER (OPTIONAL)"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                onPaste={handlePaste}
                placeholder="12-34567"
                maxLength={8}
              />

              <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                <InputField
                  label="DATE *"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="TIME *"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    backgroundColor: "#00c853",
                    color: "white",
                    padding: "12px 30px",
                    border: "none",
                    borderRadius: "30px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Input Field Component
interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  onPaste,
  maxLength,
}: InputProps): JSX.Element {
  return (
    <div style={{ marginBottom: "20px", width: "100%" }}>
      <label style={{ fontWeight: 600, fontSize: "14px" }}>{label}</label>

      <motion.input
        whileFocus={{ scale: 1.02 }}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onPaste={onPaste}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "6px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          outline: "none",
          transition: "all 0.2s ease",
          textTransform: type !== "date" && type !== "time" ? "uppercase" : "none",
        }}
      />
    </div>
  );
}