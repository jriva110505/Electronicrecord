"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, JSX } from "react";
import { motion } from "framer-motion";

interface FormData {
  instructor: string;
  section: string;
  studentName: string;
  studentId: string;
  date: string;
  time: string;
}

export default function About(): JSX.Element {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    instructor: "",
    section: "",
    studentName: "",
    studentId: "",
    date: "",
    time: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const confirmSubmission = () => {
  const data = {
    instructor: formData.instructor,
    section: formData.section,
    studentName: formData.studentName,
    studentId: formData.studentId,
    date: formData.date,
    time: formData.time,
  };

  localStorage.setItem("borrowerInfo", JSON.stringify(data));

  setAgreed(true);
  setShowModal(false);

  router.push("/supplies");
};

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

  if (!agreed) {
    setShowModal(true);
    return;
  }

  alert("Submitted Successfully!");
  router.push("/supplies");
};


  const handleClear = () => {
    setFormData({
      instructor: "",
      section: "",
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
          background: "#2e5d40",
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

              <div style={{ marginBottom: "20px", width: "100%" }}>
                <label style={{ fontWeight: 600, fontSize: "14px" }}>SECTION*</label>

                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="BSN-2A, BSN-2B, etc."
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "6px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                    outline: "none",
                    transition: "all 0.2s ease",
                    textTransform: "uppercase", // 👈 keeps formatting clean
                  }}
                />
              </div>

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
      {showModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
      padding: "20px",
    }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "#ffffff",
        width: "100%",
        maxWidth: "600px",
        height: "80vh",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #eee",
          background: "#f7faf7",
        }}
      >
        <h2 style={{ margin: 0 }}>Terms and Regulations</h2>
        <p style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
          Please read carefully before proceeding.
        </p>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div
        style={{
          padding: "20px 24px",
          overflowY: "auto",
          flex: 1,
          fontSize: "14px",
          lineHeight: 1.7,
          color: "#333",
        }}
      >
        <p>
          By submitting the Instructor and Student Information Form and borrowing
          supplies through the <b>Electronic Central Supplies Record System</b>,
          the borrower agrees to follow the rules below.
        </p>

        <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
          <li>Borrowed supplies must be used for academic purposes only.</li>
          <li>
            The borrower must provide accurate information including Instructor
            Name, Course, Student Name, Student ID, Date, and Time.
          </li>
          <li>All borrowed supplies must be returned on the same day.</li>
          <li>
            The borrower must return the item before <b>9:00 PM</b>.
          </li>
          <li>
            Items must be returned in the same condition as when borrowed.
          </li>
          <li>
            Lost or damaged items may require replacement or payment of the
            equivalent cost according to school policy.
          </li>
        </ul>

        <h3 style={{ marginTop: "20px" }}>Data Privacy</h3>

        <p>
          The system collects information such as Instructor Name, Course,
          Student Name, Student ID Number, Date, and Time for supply borrowing
          records. This information will be used only for monitoring and
          documentation in the Electronic Central Supplies Record System.
        </p>

        <p>
          All collected data will be kept confidential and accessible only to
          authorized personnel. Personal information will not be shared with
          unauthorized individuals or third parties unless required by school
          policy or law.
        </p>

        {/* CHECKBOX */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "20px",
            background: "#f6fff6",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #d4f5d4",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
            style={{ width: "18px", height: "18px" }}
          />
          <span>
            I have read and agree to the <b>Terms and Regulations</b>.
          </span>
        </label>
      </div>

      {/* FOOTER BUTTONS */}
      <div
        style={{
          borderTop: "1px solid #eee",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          background: "#fafafa",
        }}
      >
        <button
          onClick={() => setShowModal(false)}
          style={{
            padding: "8px 18px",
            borderRadius: "20px",
            border: "none",
            background: "#e0e0e0",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Cancel
        </button>

        <button
          disabled={!acceptedTerms}
          onClick={() => {
            setShowModal(false);
            confirmSubmission();
          }}
          style={{
            padding: "8px 22px",
            borderRadius: "20px",
            border: "none",
            background: acceptedTerms ? "#00c853" : "#9e9e9e",
            color: "white",
            cursor: acceptedTerms ? "pointer" : "not-allowed",
            fontWeight: 600,
          }}
        >
          Agree & Continue
        </button>
      </div>
    </motion.div>
  </div>
)}


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